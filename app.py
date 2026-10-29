import os
import calendar
import smtplib
from datetime import datetime, date, timedelta
from email.message import EmailMessage
from io import BytesIO

from flask import (
    Flask, request, jsonify, render_template,
    session, redirect, url_for
)
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)

from db import get_connection


# =========================================================
# FLASK CONFIGURATION
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if os.path.isfile(os.path.join(BASE_DIR, "templates", "login.html")):
    TEMPLATE_DIR = "templates"
elif os.path.isfile(os.path.join(BASE_DIR, "template", "login.html")):
    TEMPLATE_DIR = "template"
elif os.path.isdir(os.path.join(BASE_DIR, "templates")):
    TEMPLATE_DIR = "templates"
else:
    TEMPLATE_DIR = "template"

app = Flask(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder="static"
)

CORS(app)

app.secret_key = os.getenv(
    "SPORTS_ADMIN_SECRET",
    "change-this-to-a-long-random-secret"
)

app.permanent_session_lifetime = timedelta(days=7)


# =========================================================
# DATABASE TABLE SETUP
# =========================================================

def setup_student_table():
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS academy_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(30) NOT NULL DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cursor.execute("SHOW COLUMNS FROM academy_users LIKE 'phone'")
        if not cursor.fetchone():
            cursor.execute("""
                ALTER TABLE academy_users
                ADD COLUMN phone VARCHAR(30) NULL
            """)
            connection.commit()
            print("Student account table is ready.")

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Student table setup failed")

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def setup_admin_account():
    """Create the admin table without overwriting an existing admin."""
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("SELECT id FROM admin_users LIMIT 1")
        existing_admin = cursor.fetchone()

        # Create a first admin only if credentials are configured
        # through environment variables.
        admin_username = os.getenv("SPORTS_ADMIN_USERNAME", "").strip()
        admin_password = os.getenv("SPORTS_ADMIN_PASSWORD", "")

        if not existing_admin and admin_username and admin_password:
            cursor.execute("""
                INSERT INTO admin_users (username, password_hash)
                VALUES (%s, %s)
            """, (
                admin_username,
                generate_password_hash(admin_password)
            ))

        connection.commit()
        print("Admin table setup completed.")

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Admin table setup failed")

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =========================================================
# PDF HELPERS
# =========================================================

def create_pdf(title, subtitle, success_text, rows, footer):
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "AcademyTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=23,
        alignment=TA_CENTER,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        "AcademySubtitle",
        parent=styles["Heading2"],
        fontSize=15,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#555555"),
        spaceAfter=15
    )

    success_style = ParagraphStyle(
        "AcademySuccess",
        parent=styles["Heading2"],
        fontSize=16,
        alignment=TA_CENTER,
        spaceAfter=18
    )

    story = [
        Paragraph(title, title_style),
        Paragraph(subtitle, subtitle_style),
        Paragraph(success_text, success_style)
    ]

    table = Table(rows, colWidths=[55 * mm, 120 * mm])

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eeeeee")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 1, colors.white),
        ("INNERGRID", (0, 0), (-1, -1), 1, colors.white)
    ]))

    story.extend([
        table,
        Spacer(1, 15),
        Paragraph(
            footer,
            ParagraphStyle(
                "AcademyFooter",
                parent=styles["Normal"],
                fontSize=11,
                alignment=TA_CENTER
            )
        ),
        Spacer(1, 8),
        Paragraph(
            "<b>Sports Academy</b>",
            ParagraphStyle(
                "AcademyFooterBold",
                parent=styles["Normal"],
                fontSize=11,
                alignment=TA_CENTER
            )
        )
    ])

    document.build(story)
    buffer.seek(0)
    return buffer.getvalue()


def create_registration_pdf(data, registration_id):
    rows = [
        ["Registration ID", str(registration_id)],
        [
            "Name",
            f'{data.get("first_name", "")} {data.get("last_name", "")}'
        ],
        ["Phone", str(data.get("phone", ""))],
        ["Email", str(data.get("email", ""))],
        ["Age", str(data.get("age", ""))],
        ["Gender", str(data.get("gender", ""))],
        ["Qualification", str(data.get("qualification", ""))],
        ["Sport", str(data.get("sport", ""))],
        ["Plan", str(data.get("plan", "-"))],
        ["Amount", f'Rs. {data.get("amount", "")}'],
        ["Height", str(data.get("height", ""))],
        ["Weight", str(data.get("weight", ""))],
        ["Location", str(data.get("location", ""))],
        ["Experience", str(data.get("experience", ""))],
        ["Special Request", str(data.get("special_req", ""))]
    ]

    return create_pdf(
        "SPORTS ACADEMY",
        "REGISTRATION DETAILS",
        "REGISTRATION SUCCESSFUL",
        rows,
        "Thank you for registering with Sports Academy."
    )


def create_slot_booking_pdf(data, booking_id):
    rows = [
        ["Booking ID", str(booking_id)],
        ["Name", str(data.get("name", ""))],
        ["Gender", str(data.get("gender", ""))],
        ["Sport", str(data.get("sport", ""))],
        ["Plan", str(data.get("plan", "-"))],
        ["Amount", f'Rs. {data.get("amount", "")}'],
        ["Venue", str(data.get("venue", ""))],
        ["Date", str(data.get("booking_date", ""))],
        ["Time", str(data.get("booking_time", ""))],
        ["Month", str(data.get("month_name", ""))],
        ["Year", str(data.get("booking_year", ""))],
        ["Phone", str(data.get("phone", ""))],
        ["Email", str(data.get("email", ""))],
        ["Address", str(data.get("address", ""))]
    ]

    return create_pdf(
        "SPORTS ACADEMY",
        "SLOT BOOKING DETAILS",
        "SLOT BOOKING SUCCESSFUL",
        rows,
        "Thank you for choosing Sports Academy."
    )


# =========================================================
# EMAIL HELPERS
# =========================================================

def send_email_with_pdf(
    receiver_email, subject, message, pdf_data, filename
):
    sender_email = os.getenv("SPORTS_EMAIL", "").strip()
    sender_password = os.getenv("SPORTS_EMAIL_PASSWORD", "").strip()

    if not sender_email or not sender_password or not receiver_email:
        return False, "Email configuration or recipient is missing."

    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = f"Sports Academy <{sender_email}>"
        msg["To"] = receiver_email
        msg.set_content(message)

        msg.add_attachment(
            pdf_data,
            maintype="application",
            subtype="pdf",
            filename=filename
        )

        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        return True, "Confirmation email and PDF sent successfully."

    except Exception as e:
        app.logger.exception("Email sending failed")
        return False, str(e)


def send_registration_email(data, registration_id):
    pdf_data = create_registration_pdf(data, registration_id)

    return send_email_with_pdf(
        data.get("email", "").strip(),
        f"Sports Academy Registration Confirmation - ID #{registration_id}",
        f"""Hello {data.get("first_name", "")},

Your Sports Academy registration has been completed successfully.
Registration ID: {registration_id}

Your registration details are attached as a PDF.

Thank you,
Sports Academy
""",
        pdf_data,
        f"Sports_Academy_Registration_{registration_id}.pdf"
    )


def send_slot_booking_email(data, booking_id):
    pdf_data = create_slot_booking_pdf(data, booking_id)

    return send_email_with_pdf(
        data.get("email", "").strip(),
        f"Sports Academy Slot Booking Confirmation - ID #{booking_id}",
        f"""Hello {data.get("name", "")},

Your Sports Academy slot booking has been completed successfully.
Booking ID: {booking_id}

Your slot booking details are attached as a PDF.

Thank you,
Sports Academy
""",
        pdf_data,
        f"Sports_Academy_Slot_Booking_{booking_id}.pdf"
    )


# =========================================================
# HOME PAGE: ROOT URL ALWAYS SHOWS LOGIN
# =========================================================

@app.route("/")
def index():
    # IMPORTANT: http://127.0.0.1:5000 directly shows login.
    return render_template(
        "login.html",
        loading=False,
        error=None
    )


@app.route("/home")
def home():
    # Homepage is accessible only after student login.
    if not session.get("user_id"):
        return redirect(url_for("index"))

    return render_template("index.html")



# =========================================================
# STUDENT SIGNUP
# =========================================================

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html", error=None)

    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    phone = request.form.get("phone", "").strip()
    password = request.form.get("password", "")
    confirm_password = request.form.get("confirm_password", "")

    # Check required fields
    if not name or not email or not phone or not password or not confirm_password:
        return render_template(
            "signup.html",
            error="Please fill in all required fields."
        )

    # Validate phone number: optional + followed by 10-15 digits
    import re
    if not re.fullmatch(r"\+?[0-9]{10,15}", phone):
        return render_template(
            "signup.html",
            error="Please enter a valid phone number (10-15 digits)."
        )

    # Check password length
    if len(password) < 8:
        return render_template(
            "signup.html",
            error="Password must be at least 8 characters."
        )

    # Check password confirmation
    if password != confirm_password:
        return render_template(
            "signup.html",
            error="Passwords do not match."
        )

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Save student details including phone number
        cursor.execute("""
            INSERT INTO academy_users
                (name, email, phone, password_hash, role)
            VALUES (%s, %s, %s, %s, 'student')
        """, (
            name,
            email,
            phone,
            generate_password_hash(password)
        ))

        connection.commit()

        return redirect(url_for("index"))

    except Exception:
        if connection:
            connection.rollback()

        app.logger.exception("Student signup failed")

        return render_template(
            "signup.html",
            error="Account creation failed. This email may already exist."
        )

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



# =========================================================
# STUDENT LOGIN
# =========================================================

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template(
            "login.html",
            loading=False,
            error=None
        )

    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")

    if not email or not password:
        return render_template(
            "login.html",
            loading=False,
            error="Please enter both email and password."
        )

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, name, email, password_hash, role
            FROM academy_users
            WHERE LOWER(email) = %s
            LIMIT 1
        """, (email,))

        user = cursor.fetchone()

        if (
            user
            and user["role"] == "student"
            and check_password_hash(user["password_hash"], password)
        ):
            session.clear()
            session.permanent = True
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            session["user_email"] = user["email"]

            # login.html should redirect to /home after the loading screen.
            return render_template(
                "login.html",
                loading=True,
                error=None
            )

        return render_template(
            "login.html",
            loading=False,
            error="Invalid email or password."
        )

    except Exception:
        app.logger.exception("Student login failed")

        return render_template(
            "login.html",
            loading=False,
            error="Unable to log in. Please check the database."
        ), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =========================================================
# STUDENT LOGOUT
# =========================================================

@app.route("/logout")
def student_logout():
    session.clear()
    return redirect(url_for("index"))



# =========================================================
# MY PROFILE - STUDENT ONLY
# =========================================================

@app.route("/my-progress")
def my_progress():
    if not session.get("user_id"):
        return redirect(url_for("index"))
    return render_template("my_progress.html")


@app.route("/api/my-profile", methods=["GET"])
def my_profile_data():
    if not session.get("user_id"):
        return jsonify({"success": False, "message": "Please log in."}), 401

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, name, email, phone
            FROM academy_users
            WHERE id = %s AND role = 'student'
            LIMIT 1
        """, (session["user_id"],))
        student = cursor.fetchone()

        if not student:
            return jsonify({"success": False, "message": "Account not found."}), 404

        email = student["email"]

        cursor.execute("""
            SELECT id, first_name, last_name, phone, email, age,
                   gender, qualification, amount, height, weight,
                   location, sport, plan, experience, special_req, created_at
            FROM registrations
            WHERE LOWER(email) = LOWER(%s)
            ORDER BY id DESC
        """, (email,))
        registrations = cursor.fetchall()

        cursor.execute("""
            SELECT booking_id, name, sport, plan, amount, venue,
                   booking_date, booking_time, phone, email, address
            FROM slot_bookings
            WHERE LOWER(email) = LOWER(%s)
            ORDER BY booking_date DESC, booking_time DESC
        """, (email,))
        bookings = cursor.fetchall()

        # Attendance records are separate from bookings.
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS session_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                booking_id INT NOT NULL,
                attended TINYINT(1) NOT NULL DEFAULT 0,
                marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_booking_attendance (booking_id)
            )
        """)

        cursor.execute("""
            SELECT COUNT(*) AS attended_count
            FROM session_attendance
            WHERE user_id = %s AND attended = 1
        """, (student["id"],))
        attended_count = cursor.fetchone()["attended_count"] or 0

        today = date.today()
        for item in registrations:
            if item.get("created_at"):
                item["created_at"] = str(item["created_at"])

        for item in bookings:
            if item.get("booking_date"):
                item["booking_date"] = item["booking_date"].isoformat()
            if item.get("booking_time"):
                item["booking_time"] = str(item["booking_time"])

        upcoming = [
            b for b in bookings
            if b.get("booking_date") and b["booking_date"] >= today.isoformat()
        ]
        past = [
            b for b in bookings
            if b.get("booking_date") and b["booking_date"] < today.isoformat()
        ]

        eligible_past = len(past)
        attendance_percent = (
            round(attended_count * 100 / eligible_past)
            if eligible_past else 0
        )

        return jsonify({
            "success": True,
            "student": student,
            "registrations": registrations,
            "bookings": bookings,
            "stats": {
                "total_bookings": len(bookings),
                "upcoming_bookings": len(upcoming),
                "past_bookings": len(past),
                "attended_sessions": attended_count,
                "attendance_percentage": min(attendance_percent, 100)
            }
        })

    except Exception:
        app.logger.exception("Student profile loading failed")
        return jsonify({
            "success": False,
            "message": "Profile loading failed. Check the Flask terminal."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/api/my-profile/update", methods=["POST"])
def update_my_profile():
    if not session.get("user_id"):
        return jsonify({"success": False, "message": "Please log in."}), 401

    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()

    if not name:
        return jsonify({"success": False, "message": "Name is required."}), 400

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE academy_users
            SET name = %s, phone = %s
            WHERE id = %s AND role = 'student'
        """, (name, phone or None, session["user_id"]))

        connection.commit()
        session["user_name"] = name

        return jsonify({"success": True, "message": "Profile updated."})

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Profile update failed")
        return jsonify({"success": False, "message": "Could not update profile."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/api/my-profile/change-password", methods=["POST"])
def change_my_password():
    if not session.get("user_id"):
        return jsonify({"success": False, "message": "Please log in."}), 401

    data = request.get_json(silent=True) or {}
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")
    confirm_password = data.get("confirm_password", "")

    if len(new_password) < 8:
        return jsonify({
            "success": False,
            "message": "New password must be at least 8 characters."
        }), 400

    if new_password != confirm_password:
        return jsonify({"success": False, "message": "Passwords do not match."}), 400

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT password_hash FROM academy_users
            WHERE id = %s AND role = 'student'
            LIMIT 1
        """, (session["user_id"],))
        student = cursor.fetchone()

        if not student or not check_password_hash(
            student["password_hash"], current_password
        ):
            return jsonify({
                "success": False,
                "message": "Current password is incorrect."
            }), 400

        cursor.execute("""
            UPDATE academy_users
            SET password_hash = %s
            WHERE id = %s AND role = 'student'
        """, (
            generate_password_hash(new_password),
            session["user_id"]
        ))

        connection.commit()
        return jsonify({"success": True, "message": "Password changed successfully."})

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Password change failed")
        return jsonify({"success": False, "message": "Could not change password."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/my-registration-pdf/<int:registration_id>")
def my_registration_pdf(registration_id):
    if not session.get("user_id"):
        return redirect(url_for("index"))

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT r.*
            FROM registrations r
            JOIN academy_users u
              ON LOWER(r.email) = LOWER(u.email)
            WHERE r.id = %s
              AND u.id = %s
              AND u.role = 'student'
            LIMIT 1
        """, (registration_id, session["user_id"]))

        registration = cursor.fetchone()

        if not registration:
            return "Registration not found for your account.", 404

        pdf_data = create_registration_pdf(registration, registration_id)

        from flask import make_response
        response = make_response(pdf_data)
        response.headers["Content-Type"] = "application/pdf"
        response.headers["Content-Disposition"] = (
            f'attachment; filename="Sports_Academy_Registration_{registration_id}.pdf"'
        )
        return response

    except Exception:
        app.logger.exception("Registration PDF download failed")
        return "Unable to generate registration PDF.", 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



# =========================================================
# ADMIN PAGE
# =========================================================

@app.route("/admin", methods=["GET"])
def admin():
    if session.get("admin_logged_in"):
        return redirect(url_for("admin_dashboard"))

    return render_template(
        "admin.html",
        logged_in=False,
        error=None
    )


# =========================================================
# ADMIN LOGIN
# =========================================================

@app.route("/admin/login", methods=["POST"])
def admin_login():
    username = request.form.get("username", "").strip()
    password = request.form.get("password", "")

    if not username or not password:
        return render_template(
            "admin.html",
            logged_in=False,
            error="Username and password are required."
        )

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, username, password_hash
            FROM admin_users
            WHERE username = %s
            LIMIT 1
        """, (username,))

        admin_user = cursor.fetchone()

        if not admin_user or not check_password_hash(
            admin_user["password_hash"], password
        ):
            return render_template(
                "admin.html",
                logged_in=False,
                error="Invalid username or password."
            )

        session.clear()
        session["admin_logged_in"] = True
        session["admin_id"] = admin_user["id"]
        session["admin_username"] = admin_user["username"]

        return redirect(url_for("admin_dashboard"))

    except Exception:
        app.logger.exception("Admin login failed")

        return render_template(
            "admin.html",
            logged_in=False,
            error="Unable to log in. Please check the database."
        ), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@app.route("/admin/dashboard", methods=["GET"])
def admin_dashboard():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin"))

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id, first_name, last_name, phone, email,
                age, gender, qualification, amount,
                height, weight, location, sport, plan,
                experience, special_req, created_at
            FROM registrations
            ORDER BY id DESC
        """)
        registrations = cursor.fetchall()

        cursor.execute("""
            SELECT
                booking_id AS id,
                name, gender, sport, plan, amount, venue,
                booking_date AS booking_data,
                booking_time,
                month AS month_name,
                year AS booking_year,
                phone, email, address
            FROM slot_bookings
            ORDER BY booking_id DESC
        """)
        bookings = cursor.fetchall()

        cursor.execute("SELECT COUNT(*) AS total FROM registrations")
        registration_count = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM slot_bookings")
        booking_count = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(DISTINCT sport) AS total
            FROM registrations
            WHERE sport IS NOT NULL AND sport != ''
        """)
        sports_count = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM slot_bookings
            WHERE booking_date = CURDATE()
        """)
        today_bookings = cursor.fetchone()["total"]

        return render_template(
            "admin.html",
            logged_in=True,
            admin_username=session.get("admin_username", "Admin"),
            registrations=registrations,
            bookings=bookings,
            registration_count=registration_count,
            booking_count=booking_count,
            sports_count=sports_count,
            today_bookings=today_bookings
        )

    except Exception:
        app.logger.exception("Admin dashboard failed")
        return "Unable to load the admin dashboard. Check the Flask terminal.", 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =========================================================
# DELETE REGISTRATION
# =========================================================

@app.route(
    "/admin/delete-registration/<int:registration_id>",
    methods=["POST"]
)
def delete_registration(registration_id):
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin"))

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM registrations WHERE id = %s",
            (registration_id,)
        )

        connection.commit()

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Delete registration failed")

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return redirect(url_for("admin_dashboard"))


# =========================================================
# DELETE SLOT BOOKING
# =========================================================

@app.route(
    "/admin/delete-booking/<int:booking_id>",
    methods=["POST"]
)
def delete_booking(booking_id):
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin"))

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM slot_bookings WHERE booking_id = %s",
            (booking_id,)
        )

        connection.commit()

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Delete slot booking failed")

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    return redirect(url_for("admin_dashboard"))


# =========================================================
# ADMIN LOGOUT
# =========================================================

@app.route("/admin/logout")
def admin_logout():
    session.clear()
    return redirect(url_for("admin"))


# =========================================================
# REGISTRATION API
# =========================================================

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No registration data received."
        }), 400

    required_fields = [
        "first_name", "last_name", "phone", "email",
        "age", "gender", "qualification", "amount",
        "location", "sport"
    ]

    for field in required_fields:
        if not str(data.get(field, "")).strip():
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    connection = None
    cursor = None

    try:
        amount = float(
            str(data.get("amount", "0"))
            .replace("₹", "")
            .replace(",", "")
            .strip()
        )

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO registrations (
                first_name, last_name, phone, email,
                age, gender, qualification, amount,
                height, weight, location, sport,
                plan, experience, special_req
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s
            )
        """, (
            data.get("first_name"),
            data.get("last_name"),
            data.get("phone"),
            data.get("email"),
            data.get("age"),
            data.get("gender"),
            data.get("qualification"),
            amount,
            data.get("height"),
            data.get("weight"),
            data.get("location"),
            data.get("sport"),
            data.get("plan", ""),
            data.get("experience", ""),
            data.get("special_req", "")
        ))

        connection.commit()
        registration_id = cursor.lastrowid

        email_sent, email_message = send_registration_email(
            data, registration_id
        )

        return jsonify({
            "success": True,
            "message": "Registration completed successfully.",
            "registration_id": registration_id,
            "email_sent": email_sent,
            "email_message": email_message
        })

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Please enter a valid amount."
        }), 400

    except Exception as e:
        if connection:
            connection.rollback()

        app.logger.exception("Registration failed")

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =========================================================
# GET REGISTRATION DETAILS
# =========================================================

@app.route("/registration/<int:registration_id>", methods=["GET"])
def get_registration(registration_id):
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id, first_name, last_name, phone, email,
                age, gender, qualification, amount,
                height, weight, location, sport, plan,
                experience, special_req, created_at
            FROM registrations
            WHERE id = %s
        """, (registration_id,))

        registration = cursor.fetchone()

        if not registration:
            return jsonify({
                "success": False,
                "message": "Registration not found."
            }), 404

        return jsonify({
            "success": True,
            "registration": registration
        })

    except Exception as e:
        app.logger.exception("Get registration failed")

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# =========================================================
# SLOT BOOKING API
# =========================================================

@app.route("/slot-book", methods=["POST"])
def slot_book():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No slot booking data received."
        }), 400

    # Check whether the student is logged in
    if not session.get("user_id"):
        return jsonify({
            "success": False,
            "message": "Please log in before booking."
        }), 401

    # Get email from the logged-in account
    user_email = session.get("user_email", "").strip().lower()

    if not user_email:
        return jsonify({
            "success": False,
            "message": "Your account email is missing. Please log in again."
        }), 401

    # Always use the logged-in user's email
    data["email"] = user_email

    required_fields = [
        "name", "gender", "sport", "amount", "venue",
        "booking_date", "booking_time", "phone", "address"
    ]

    for field in required_fields:
        if not str(data.get(field, "")).strip():
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    connection = None
    cursor = None

    try:
        booking_date = datetime.strptime(
            str(data.get("booking_date")),
            "%Y-%m-%d"
        ).date()

        if booking_date < date.today():
            return jsonify({
                "success": False,
                "message": "Please select today or a future date."
            }), 400

        month_name = data.get("month_name") or calendar.month_name[
            booking_date.month
        ]

        booking_year = int(
            data.get("booking_year") or booking_date.year
        )

        connection = get_connection()
        cursor = connection.cursor()

        # Prevent duplicate booking for the same slot
        cursor.execute("""
            SELECT booking_id
            FROM slot_bookings
            WHERE sport = %s
              AND venue = %s
              AND booking_date = %s
              AND booking_time = %s
            LIMIT 1
        """, (
            data.get("sport"),
            data.get("venue"),
            booking_date,
            data.get("booking_time")
        ))

        existing_booking = cursor.fetchone()

        if existing_booking:
            return jsonify({
                "success": False,
                "message": "This slot is already booked.",
                "booking_id": existing_booking[0]
            }), 409

        # Prepare booking details
        data["month_name"] = month_name
        data["booking_year"] = booking_year

        cursor.execute("""
            INSERT INTO slot_bookings (
                name, gender, sport, plan, amount,
                venue, booking_date, booking_time,
                month, year, phone, email, address
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s
            )
        """, (
            data.get("name"),
            data.get("gender"),
            data.get("sport"),
            data.get("plan", ""),
            data.get("amount"),
            data.get("venue"),
            booking_date,
            data.get("booking_time"),
            month_name,
            booking_year,
            data.get("phone"),
            data["email"],
            data.get("address")
        ))

        connection.commit()
        booking_id = cursor.lastrowid

        email_sent, email_message = send_slot_booking_email(
            data, booking_id
        )

        return jsonify({
            "success": True,
            "message": "Slot booked successfully.",
            "booking_id": booking_id,
            "email_sent": email_sent,
            "email_message": email_message
        })

    except ValueError:
        if connection:
            connection.rollback()

        return jsonify({
            "success": False,
            "message": "Invalid booking date or year."
        }), 400

    except Exception as e:
        if connection:
            connection.rollback()

        app.logger.exception("Slot booking failed")

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()

# =========================================================
# FLASK STARTUP
# =========================================================

if __name__ == "__main__":
    setup_student_table()
    setup_admin_account()

    app.run(
        debug=True,
        port=5000
    )
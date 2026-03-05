from django.shortcuts import render, get_object_or_404
from .models import Service

def home(request):
    services = Service.objects.all()
    return render(request, "home.html", {
        "services": services
    })

def services(request):
    services = Service.objects.all()
    return render(request, "services.html", {"services": services})

def service_detail(request, slug):
    service = get_object_or_404(Service, slug=slug)
    return render(request, "service_detail.html", {"service": service})

def about(request):
    return render(request, "about.html")

from django.core.mail import send_mail
from django.shortcuts import redirect
from .models import ContactSubmission

def contact(request):
    if request.method == "POST":
        full_name = request.POST.get("full_name")
        company_name = request.POST.get("company_name")
        phone = request.POST.get("phone")
        email = request.POST.get("email")
        service_type = request.POST.get("service_type")
        message = request.POST.get("message")

        # Save to database
        ContactSubmission.objects.create(
            full_name=full_name,
            company_name=company_name,
            phone=phone,
            email=email,
            service_type=service_type,
            message=message
        )

        # Send email notification
        send_mail(
            subject=f"New Website Inquiry - {service_type}",
            message=f"""
Name: {full_name}
Company: {company_name}
Phone: {phone}
Email: {email}

Message:
{message}
            """,
            from_email=None,
            recipient_list=["pinewoodelectric@hotmail.com"],
        )

        return redirect("contact")

    return render(request, "contact.html")

def faq(request):
    return render(request, 'faq.html')
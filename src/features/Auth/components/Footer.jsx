import { useState } from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const footerSections = [
  { title: "Services", links: ["Sell Phone", "Sell Laptop", "Sell Tablet", "Sell Smart Watch", "Sell Smart Speakers", "Sell DSLR Camera", "Sell Earbuds", "Repair Phone", "Buy Gadgets", "Recycle Phone", "Find New Phone", "Partner With Us"] },
  { title: "Company", links: ["About Us", "Careers", "Articles", "Press Releases", "Become FELCON Partner", "Become Supersale Partner", "Corporate Information"] },
  { title: "Sell Device", links: ["Mobile Phone", "Laptop", "Tablet", "iMac", "Gaming Consoles"] },
  { title: "Help & Support", links: ["FAQ", "Contact Us", "Warranty Policy", "Refund Policy"] },
  { title: "More Info", links: ["Terms & Conditions", "Privacy Policy", "Terms of Use", "E-Waste Policy", "Cookie Policy", "What is Refurbished", "Device Safety"] },
];

const FooterAccordion = ({ title, links }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 sm:border-0">
      <button
        className="sm:hidden w-full flex items-center justify-between py-3 text-sm font-semibold"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <h3 className="hidden sm:block font-semibold mb-3 text-sm md:text-base">{title}</h3>
      <ul className={`space-y-2 text-xs sm:text-sm pb-3 sm:pb-0 ${open ? "block" : "hidden"} sm:block`}>
        {links.map((item) => (
          <li key={item}>
            <a href="#" className="hover:text-[#00b4d8]">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#F4F8FF] text-[#123B75] pt-10 md:pt-14 border-t border-[#DCEBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-6 md:pb-10">

        {/* Mobile-only header */}
        <div className="sm:hidden mb-6">
          <a href="/" className="text-3xl font-black text-[#123B75] block mb-4 tracking-tight flex items-center gap-2">
            <img src="/logo.png" alt="FELCON" className="h-8 w-auto object-contain rounded" />
            <span style={{ letterSpacing: "0.08em" }}>FELCON</span>
          </a>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-[#123B75]/70 whitespace-nowrap">Follow us on</p>
            <div className="flex gap-3">
              {[FaTwitter, FaFacebookF, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="bg-[#EDF4FF] text-[#1D5EDB] p-2 rounded-full border border-[#DCEBFF] hover:bg-[#3478F6] hover:text-white transition"><Icon /></a>
              ))}
            </div>
          </div>
          <a href="/chat" className="mt-4 flex justify-center items-center gap-2 bg-[#3478F6] hover:bg-[#1D5EDB] text-white px-4 py-3 rounded-xl text-sm font-bold w-full shadow-sm transition">
            💬 Chat with Us
          </a>
        </div>

        {/* Tablet: logo + 3-col sections */}
        <div className="hidden sm:grid md:hidden grid-cols-3 gap-6 mb-6">
          <div className="col-span-3 flex items-center justify-between mb-2">
            <a href="/" className="text-2xl font-black text-[#123B75] tracking-tight flex items-center gap-2">
              <img src="/logo.png" alt="FELCON" className="h-7 w-auto object-contain rounded" />
              <span style={{ letterSpacing: "0.08em" }}>FELCON</span>
            </a>
            <div className="flex gap-2">
              {[FaTwitter, FaFacebookF, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="bg-[#EDF4FF] text-[#1D5EDB] p-2 rounded-full border border-[#DCEBFF] hover:bg-[#3478F6] hover:text-white transition"><Icon /></a>
              ))}
            </div>
            <a href="/chat" className="flex items-center gap-2 bg-[#3478F6] hover:bg-[#1D5EDB] text-white px-3.5 py-2 rounded-xl text-sm font-bold shadow-sm transition">
              💬 Chat with Us
            </a>
          </div>
          {footerSections.map((section) => (
            <FooterAccordion key={section.title} {...section} />
          ))}
        </div>

        {/* Desktop: 6-col grid */}
        <div className="hidden md:grid grid-cols-6 gap-8 lg:gap-10">
          <div>
            <a href="/" className="text-3xl font-black text-[#123B75] block mb-4 tracking-tight flex items-center gap-2">
              <img src="/logo.png" alt="FELCON" className="h-8 w-auto object-contain rounded" />
              <span style={{ letterSpacing: "0.08em" }}>FELCON</span>
            </a>
            <p className="mb-2 text-sm font-semibold text-[#123B75]/70">Follow us on</p>
            <div className="flex gap-3 mb-4">
              {[FaTwitter, FaFacebookF, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="bg-[#EDF4FF] text-[#1D5EDB] p-2 rounded-full border border-[#DCEBFF] hover:bg-[#3478F6] hover:text-white transition"><Icon /></a>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new Event("open-chatbot"))}
              className="inline-flex items-center gap-2 bg-[#3478F6] hover:bg-[#1D5EDB] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition"
            >
              💬 Chat with Us
            </button>
          </div>
          {footerSections.map((section) => (
            <FooterAccordion key={section.title} {...section} />
          ))}
        </div>

        {/* Mobile accordion only */}
        <div className="sm:hidden">
          {footerSections.map((section) => (
            <FooterAccordion key={section.title} {...section} />
          ))}
        </div>
      </div>

      <div className="border-t border-[#DCEBFF]" />

      {/* Bottom section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 items-start">
        <div className="sm:col-span-1 md:col-span-2 text-xs sm:text-sm text-[#123B75]/70 space-y-2">
          <p className="font-bold text-[#123B75] text-sm">FELCON SOLUTIONS INDIA LLP</p>
          <p className="leading-relaxed">
            <span className="font-semibold text-[#123B75]">Business Address:</span> Shop 11, I 62/63, Navgrah Building, Poonam Sagar Complex, Mira Road East, Mira Bhayandar, Thane – 401107, Maharashtra, India.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
            <p>
              <span className="font-semibold text-[#123B75]">Contact:</span>{" "}
              <a href="tel:8355989998" className="text-[#1D5EDB] hover:underline font-medium">8355989998</a>,{" "}
              <a href="tel:7021699033" className="text-[#1D5EDB] hover:underline font-medium">7021699033</a>
            </p>
            <p>
              <span className="font-semibold text-[#123B75]">Email:</span>{" "}
              <a href="mailto:Felconsolutionsindia@gmail.com" className="text-[#1D5EDB] hover:underline font-medium">Felconsolutionsindia@gmail.com</a>
            </p>
          </div>
          <p className="text-xs pt-1 text-[#123B75]/60">** All product names, logos, and brands are property of their respective owners.</p>
        </div>
        <div className="bg-white border border-[#DCEBFF] rounded-2xl p-4 flex gap-3 items-start shadow-sm">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#EDF4FF] border border-[#3478F6]/30 flex items-center justify-center text-xl flex-shrink-0">
            🛡️
          </div>
          <div>
            <h4 className="font-extrabold text-xs md:text-sm text-[#123B75]">Safeguarded by FELCON Shield</h4>
            <p className="text-xs text-[#123B75]/70 mt-1">All devices are hardware-tested and data-wiped with NIST 800-88 compliance.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DCEBFF] py-4 text-center text-xs sm:text-sm text-[#123B75]/60 font-medium">
        Copyright © 2026 FELCON SOLUTIONS INDIA LLP. All rights reserved.
      </div>
    </footer>
  );
}
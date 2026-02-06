import React from "react";
import Navbar from "../components/common/Navbar";
import ayushiPic from "../../public/ayushi.jpg";
import devanshPic from "../../public/devansh.jpeg";

function AboutUs() {
  return (
    <>
    <Navbar/>
    <div className="bg-white mt-24 text-black px-4 sm:px-8 lg:px-24 py-14 space-y-20">

      {/* HERO */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Rethinking Attendance
        </h1>
        <p className="text-gray-600 text-lg">
          Built from real college problems. Designed with technology that scales.
        </p>
      </section>

      {/* WHO WE ARE */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Who We Are</h2>
          <p className="text-gray-700">
            We are a group of two dedicated individuals passionate about using
            technology to improve educational experiences. Our mission is to
            simplify attendance management and make it accurate, fast, and reliable.
          </p>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6">
          <p className="text-sm text-indigo-700 font-semibold mb-2">
            💡 Mission
          </p>
          <p className="text-gray-800">
            Streamline attendance management through innovative, scalable, and
            hardware-independent solutions.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">The Problem We Faced In Our College</h2>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">⏱ Time Wasted</h3>
            <p className="text-gray-600 text-sm">
              Teachers spend 10–15 minutes of every lecture taking attendance for
              150+ students.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">❌ False Proxies</h3>
            <p className="text-gray-600 text-sm">
              Manual and RFID systems allow students to proxy for each other.
            </p>
          </div>

          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-2">📄 Management Overhead</h3>
            <p className="text-gray-600 text-sm">
              Managing attendance records itself becomes a humongous task.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h2>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="border rounded-2xl p-6 text-center">
            <img src={ayushiPic} className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4" />
            <h3 className="font-semibold">Ayushi Pal</h3>
            <p className="text-sm text-gray-600">Frontend Developer</p>
            <p className="text-sm mt-3">
              Focused on state management, UI optimization, and performance.
            </p>
            <p className="text-sm text-blue-600 mt-2">ayushipal06@gmail.com</p>
          </div>

          <div className="border rounded-2xl p-6 text-center">
            <img src={devanshPic} className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4" />
            <h3 className="font-semibold">Devansh Dubey</h3>
            <p className="text-sm text-gray-600">Backend Developer</p>
            <p className="text-sm mt-3">
              Designed database models and solved complex backend logic.
            </p>
            <p className="text-sm text-blue-600 mt-2">devanshdubey1827@gmail.com</p>
          </div>
        </div>
      </section>

      {/* WHY NOT EXISTING SOLUTIONS */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Why Existing Solutions Didn’t Work
        </h2>

        <div className="space-y-4">
          <div className="p-5 bg-gray-50 rounded-xl">
            <strong>Biometric Systems:</strong> Not scalable and require additional hardware.
          </div>
          <div className="p-5 bg-gray-50 rounded-xl">
            <strong>RFID Systems:</strong> Easy to proxy and hardware-dependent.
          </div>
          <div className="p-5 bg-gray-50 rounded-xl">
            <strong>Face Cameras:</strong> Difficult to manage for large classrooms.
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="max-w-5xl mx-auto bg-indigo-600 text-white rounded-3xl p-10">
        <h2 className="text-2xl font-semibold mb-4">Our Solution</h2>
        <p className="text-lg">
          Face Recognition combined with Geolocation.
        </p>
        <p className="text-sm mt-3 opacity-90">
           After brainstorming, we came up with the idea of using{" "}
          <span className="font-semibold">
            Face Recognition combined with Geolocation
          </span>{" "}
          to mark attendance. This ensures that the student is physically present
          in the classroom and is the actual person marking attendance.
        </p>
      </section>

      {/* JOURNEY */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Our Journey</h2>

        <div className="border-l-4 border-indigo-600 pl-6 space-y-6">
          <p>
            We have been working on this project for the past one year, facing
            technical hurdles and design challenges.
          </p>
          <p>
           Designing the management application required extensive brainstorming
          and logical thinking. For example, on the backend, Devansh faced
          challenges in designing the database model—deciding what should depend
          on what, whether branches depend on courses or vice versa. On the
          frontend, I worked on handling state efficiently and optimizing the
          application.
          </p>
          <p>
            Despite these challenges, we are happy to have overcome them and are
          proud to present this solution.
          </p>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">We’d Love Your Feedback</h2>
        <p className="text-gray-700">
           We strongly believe in constructive criticism—it is how we have grown
          while developing this project together. Similarly, we would love to
          receive your feedback. Please try the app and share your thoughts with
          us.
        </p>
      </section>

      {/* DEMO */}
      <section className="max-w-3xl mx-auto bg-gray-100 rounded-2xl p-6 text-center">
        <h3 className="font-semibold mb-3">Demo Credentials</h3>
        <p>Email: <span className="font-mono">demo@rgipt.ac.in</span></p>
        <p>Password: <span className="font-mono">12QWerty@</span></p>
      </section>
    </div>
    </>
  );
}

export default AboutUs;

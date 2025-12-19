import bgAuth from '../../public/bg-auth.jpg'; // Adjust the image path
import SignUpForm from '../components/core/Auth/SignUpForm'; // Import the form component

const SignUpPage = ({ isLogin }) => {
  return (
    <div className="flex mx-auto bg-white shadow-xl shadow-black w-[85%]  my-10 rounded-lg overflow-hidden">
      {/* Left Column: Image (Hidden on mobile) */}
      <div className="hidden w-1/2 md:block ">
        <img
          className="h-full w-full rounded-lg object-cover"
          src={bgAuth}
          alt="Sign up illustration"
        />
      </div>

      {/* Right Column: Form Container */}
      {/* It's scrollable in case the form is too long for the screen height */}
      <div className="flex rounded-lg w-full items-center justify-center  p-8 md:w-1/2   ">
        <div className="w-full max-w-2xl">

          <SignUpForm isLogin={isLogin}/>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

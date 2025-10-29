export default function WaitApprovalPage() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background bg-gradient text-txt">
      <div>
        <p className="text-2xl">Thank you for registering</p>
        <p className="text-sm text-gray-400 mb-6">
          Your account is currently under review. Please wait🙏
        </p>
        <span className="loading loading-spinner"></span>
      </div>
    </div>
  );
}

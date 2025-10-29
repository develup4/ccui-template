export default function FormButton({
  children,
  loading = false,
  disabled = false,
  width = "w-full",
  height = "h-10",
  textSize = "text-xs",
}: any) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`${width} ${height} bg-highlight/90 hover:bg-highlight disabled:bg-gray-700 ${textSize} font-bold text-white disabled:cursor-not-allowed rounded-md px-4 py-2`}
    >
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className="flex justify-center items-center">{children}</div>
      )}
    </button>
  );
}

export default function FormButton({
  text,
  loading = false,
  disabled = false,
  width = "w-full",
  height = "h-12",
  textSize = "text-xs",
  ...other
}: any) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`${width} ${height} rounded-lg p-3 bg-sky-500/80 hover:bg-sky-500 disabled:bg-gray-700 ${textSize} font-poppins text-white disabled:cursor-not-allowed`}
    >
      {loading ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}

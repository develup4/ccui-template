export default function VerticalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="size-full">
            <div className="w-full min-h-[10rem]"></div>
            <div className="w-full h-16 flex">
                <div>Left Top</div>
                <div>Right Top</div>
            </div>
            <div className="size-full flex items-center mt-[10rem]">
                <div className="max-w-screen-2xl max-h-[calc(100vh-20rem)] flex">
                    <div className="min-w-80">Left Panel</div>
                    {children}
                </div>
            </div>
        </div>  
    );
}

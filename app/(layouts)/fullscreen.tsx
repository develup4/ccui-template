export default function VerticalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="w-full h-screen">
            <div className="w-full min-h-[10rem]"></div>
            <div className="size-full flex">
                <div className="w-[30rem]">Left Panel</div>
                {children}
                <div className="w-[30rem]">Right Panel</div>
            </div>
        </div>  
    );
}

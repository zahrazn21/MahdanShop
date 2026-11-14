interface ProductsLayoutProps {
  children: React.ReactNode;
}

export default function ProductsLayout({ 
  children, 

}: ProductsLayoutProps) {
  return (
    <div className="container md:mx-auto md:px-4 px-2 md:py-8 py-2">
      <div>
        {children}
      </div>
      <div>
      </div>
    </div>
  );
}
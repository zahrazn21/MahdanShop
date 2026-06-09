interface ProductsLayoutProps {
  children: React.ReactNode;
}

export default function ProductsLayout({ 
  children, 

}: ProductsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
     

      <div>
        {children}
      </div>
      <div>
      </div>
    </div>
  );
}
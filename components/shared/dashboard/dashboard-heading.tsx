interface HeadingProps {
    title: string;
    description: string;
    isAdmin?:boolean
  }
  
  export const Heading: React.FC<HeadingProps> = ({ title, description, isAdmin }) => {
    return (
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{isAdmin? title : "Sản phẩm"}</h2>
        <p className="text-sm text-muted-foreground">{isAdmin ?description : "Thông tin sản phẩm đấu giá"}</p>
      </div>
    );
  };
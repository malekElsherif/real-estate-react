import { usegetimgbyid } from "../../hooks/usefiles";

type ImgcardProps = {
  propertyId: number;
};

const Imgcard = ({ propertyId }: ImgcardProps) => {
  const { data, isLoading, isError } = usegetimgbyid(propertyId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-100">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-100">
        <span className="text-red-500">Failed to load image</span>
      </div>
    );
  }

  const images = data ?? [];
  


  return (
    <div className="h-64 w-full overflow-hidden bg-slate-100">
      {images.length > 0 ? (
        <img
          src={'http://localhost:3001' + images[0].url}
          alt="Property"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-5xl">🏠</span>
        </div>
      )}
    </div>
  );
};

export default Imgcard;
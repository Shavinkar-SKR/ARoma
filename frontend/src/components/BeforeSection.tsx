import before from "../assets/before.png";

const BeforeSection = () => {
  return (
    <div className="py-16 bg-red-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8 animate-float">
            <img
              src={before}
              alt="Elegant food presentation"
              className="w-64 h-auto"
            />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
            Dine Smart, Dine ARoma!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BeforeSection;

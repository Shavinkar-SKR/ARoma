import { useEffect, useState } from "react";
import { ARModelViewer } from "@/components/ARViewModal";

const ARView = () => {
  const [params, setParams] = useState<{
    model: string | null;
    name: string | null;
  }>({
    model: null,
    name: null,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get("model");
    const name = urlParams.get("name");
    setParams({ model, name });
  }, []);

  if (!params.model) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-[40vw] ml-auto mr-auto flex p-8 items-center justify-between">
      <div className="relative h-96 w-full bg-gray-100 rounded-lg">
        <ARModelViewer modelUrl={params.model} autoActivateAR={true} />
        <div className="absolute top-2 left-0 right-0">
          <h1 className="text-xl font-bold text-center">
            {params.name || "AR View"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ARView;

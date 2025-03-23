import "@google/model-viewer/";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";

interface ARViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  itemName: string;
}

interface ARModelViewerProps {
  modelUrl: string;
  showARButton?: boolean;
  autoActivateAR?: boolean;
  className?: string;
}

export const ARModelViewer: React.FC<ARModelViewerProps> = ({
  modelUrl,
  showARButton = true,
  autoActivateAR = false,
  className = "",
}) => {
  const modelViewerRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : "",
  );

  useEffect(() => {
    if (autoActivateAR && isMobile && modelViewerRef?.current) {
      const timer = setTimeout(() => {
        try {
          modelViewerRef?.current.activateAR();
        } catch (error) {
          console.error("Failed to auto-activate AR:", error);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoActivateAR, modelViewerRef]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        shadow-intensity="1"
        auto-rotate
        ar-scale="auto"
        ar-placement="floor"
        style={{ width: "100%", height: "100%" }}
        data-js-focus-visible
      >
        {showARButton && isMobile && (
          <Button
            slot="ar-button"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              modelViewerRef.current?.activateAR?.();
            }}
          >
            View in your space
          </Button>
        )}
      </model-viewer>
    </div>
  );
};

const ARViewModal: React.FC<ARViewModalProps> = ({
  isOpen,
  onClose,
  modelUrl,
  itemName,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const modelViewerRef = useRef(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    if (isOpen) {
      const baseUrl = window.location.origin;
      const arViewUrl = `${baseUrl}/ar-view?model=${encodeURIComponent(modelUrl)}&name=${encodeURIComponent(itemName)}`;
      setQrValue(arViewUrl);
    }
  }, [isOpen, modelUrl, itemName]);

  const handleClose = () => {
    if (modelViewerRef.current) {
      try {
        const modelViewer = document.querySelector("model-viewer");
        if (modelViewer && modelViewer.activateAR) {
          modelViewer.removeAttribute("auto-rotate");
        }
      } catch (error) {
        console.error("Error cleaning up AR session:", error);
      }
    }

    onClose();
  };

  return (
    <Dialog className="bg-[#1818188f]" open={isOpen}>
      <DialogContent className="p-0 w-[100%] max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-center text-2xl font-bold">
            {itemName} - AR View
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="w-[50vw] flex flex-col md:flex-row p-auto gap-8 items-center justify-between">
          <div className="relative h-96 w-full md:w-3/5 bg-gray-100 rounded-lg">
            <ARModelViewer
              modelUrl={modelUrl}
              showARButton={isMobile}
              ref={modelViewerRef}
            />
          </div>
          {!isMobile && (
            <div className="flex flex-col items-center justify-center md:w-2/5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium">Scan to view on mobile</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Use your phone to experience AR view
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCode
                  value={qrValue}
                  size={240}
                  style={{ height: "auto", maxWidth: "240px", width: "100%" }}
                  viewBox={`0 0 256 256`}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                />
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  Restaurant Digital Menu Experience
                </p>
              </div>
            </div>
          )}
        </div>
        {isMobile && (
          <div className="p-6 pt-0">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
              onClick={() => {
                document.querySelector("model-viewer")?.activateAR?.();
              }}
            >
              Launch AR Experience
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ARViewModal;

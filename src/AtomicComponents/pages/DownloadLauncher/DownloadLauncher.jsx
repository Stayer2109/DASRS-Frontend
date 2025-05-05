/** @format */
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Download } from "lucide-react";

const DownloadLauncher = () => {
  const handleDownload = () => {
    // Create a link to the file
    const link = document.createElement("a");
    link.href = "/launcher/dasrs.exe";
    link.download = "dasrs.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">DASRS Launcher</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">About the Launcher</h2>
        <p className="mb-4">
          The Digital Automotive Simulation Racing System (DASRS) Launcher provides a seamless experience for players to connect to tournaments, manage their profiles, and participate in racing events.
        </p>
        <p className="mb-6">
          With our custom launcher, you'll have access to all the tools you need to enhance your racing experience.
        </p>
        
        <h3 className="text-xl font-semibold mb-3">Key Features:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Easy tournament registration and participation</li>
          <li>Seamless integration with your DASRS account</li>
          <li>Automatic updates to ensure you have the latest features</li>
          <li>Optimized connection to racing servers</li>
        </ul>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleDownload}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg"
          >
            <Download className="w-5 h-5" />
            Download DASRS Launcher
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">System Requirements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Minimum Requirements:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>OS:</strong> Windows Vista</li>
              <li><strong>Processor:</strong> 2.66 GHz Intel Core 2 Duo E6700</li>
              <li><strong>Memory:</strong> 2 GB RAM</li>
              <li><strong>Graphics:</strong> Nvidia GeForce 8800 GT</li>
              <li><strong>DirectX:</strong> Version 9.0c</li>
              <li><strong>Storage:</strong> 1 GB available space</li>
              <li><strong>Sound card:</strong> Sound card compatible with DirectX® 9.0с</li>
              <li><strong>Additional notes:</strong> The application's stability is not guaranteed on Intel HD Graphics and AMD HD Radeon on-board graphics cards.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Recommended:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>OS:</strong> Windows 10 and above</li>
              <li><strong>Processor:</strong> 3.5 GHz Intel i7 3770K</li>
              <li><strong>Memory:</strong> 4 GB RAM</li>
              <li><strong>Graphics:</strong> Nvidia GTX 1060</li>
              <li><strong>DirectX:</strong> Latest stable version</li>
              <li><strong>Storage:</strong> 2 GB available space</li>
              <li><strong>Sound card:</strong> Sound card compatible with DirectX® 9.0с</li>
              <li><strong>Additional notes:</strong> The application's stability is not guaranteed on Intel HD Graphics and AMD HD Radeon on-board graphics cards.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadLauncher;

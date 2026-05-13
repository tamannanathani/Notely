import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function WelcomePage(){
  const navigate = useNavigate();

  const features = [
    {
      title: "✨ AI-Powered Enhancement",
      description: "Enhance your notes with AI-powered summarization and improvements"
    },
    {
      title: "⚡ Lightning Fast",
      description: "Intuitive and responsive experience optimized for productivity"
    },
    {
      title: "🔒 Secure & Private",
      description: "Your notes are encrypted and protected with secure authentication"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">
              Notely
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern note-taking app to keep your thoughts organized and accessible anytime, anywhere.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-primary-600 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}

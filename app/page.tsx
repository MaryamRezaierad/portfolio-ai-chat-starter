import { AIChat } from "@/components/AIChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Portfolio Name
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            UX Designer • Product Designer • Researcher
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hi! I'm passionate about creating user-centered designs that solve real problems. 
            Try the AI assistant in the bottom-right corner to learn more about my work!
          </p>
        </div>

        {/* Sample Project Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          <ProjectCard
            title="Mobile Banking Redesign"
            description="Increased user engagement by 40% through streamlined navigation"
            tags={["UX Research", "Mobile Design", "User Testing"]}
          />
          <ProjectCard
            title="E-commerce Checkout"
            description="Reduced cart abandonment by 30% with optimized flow"
            tags={["Conversion Optimization", "A/B Testing"]}
          />
          <ProjectCard
            title="Healthcare Dashboard"
            description="Improved task efficiency for medical staff by 60%"
            tags={["Enterprise UX", "Data Visualization"]}
          />
        </div>

        {/* Instructions */}
        <div className="mt-20 max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">✨ Try the AI Assistant</h2>
          <p className="text-gray-700 mb-4">
            Click the chat button in the bottom-right corner and ask questions like:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• "Tell me about your mobile banking project"</li>
            <li>• "What's your design process?"</li>
            <li>• "What tools do you use?"</li>
            <li>• "Tell me about your user research experience"</li>
          </ul>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChat endpoint={process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chat"} />
    </main>
  );
}

function ProjectCard({ 
  title, 
  description, 
  tags 
}: { 
  title: string; 
  description: string; 
  tags: string[];
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4"></div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span 
            key={i}
            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

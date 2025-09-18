import { BookOpen, Infinity, DollarSign, Headphones, Users } from "lucide-react";

const features = [
  { icon: BookOpen, text: "20k+ Online Courses" },
  { icon: Infinity, text: "Lifetime Access" },
  { icon: DollarSign, text: "Value For Money" },
  { icon: Headphones, text: "Lifetime Support" },
  { icon: Users, text: "Community Support" },
];

export default function FeaturesBar() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-6 mt-10">
      {features.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
        >
          <item.icon className="w-5 h-8 text-gray-800" />
          <span className="text-sm font-medium">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

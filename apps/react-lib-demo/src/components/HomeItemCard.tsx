import { Card } from "@radix-ui/themes";
import { Link } from "react-router";
import type { MenuRoute } from "@/menu";

interface HomeItemCardProps {
  item: MenuRoute;
}

export default function HomeItemCard({ item }: HomeItemCardProps) {
  return (
    <Link to={item.path} className="group">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-violet-600">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </Card>
    </Link>
  );
}

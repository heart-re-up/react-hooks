import { Flex, Heading } from "@radix-ui/themes";

export type DemoHeaderProps = {
  title: string;
  description?: string;
};

export default function DemoHeader({ title, description }: DemoHeaderProps) {
  return (
    <Flex direction="column" gap="2">
      <Heading size="9" weight="bold">
        {title}
      </Heading>
      {description && (
        <Heading size="3" color="gray">
          {description}
        </Heading>
      )}
    </Flex>
  );
}

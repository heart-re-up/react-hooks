import { Flex, Heading } from "@radix-ui/themes";
import DemoRelation, { DemoRelationProps } from "./DemoRelation";

export type DemoRelationListProps = {
  relations: readonly DemoRelationProps[];
};

export default function DemoRelationList({ relations }: DemoRelationListProps) {
  return (
    <Flex direction="column" gap="4" mt="2">
      <Heading size="7">Relations</Heading>
      <Flex direction="column" gap="4">
        {relations.map((relation) => (
          <DemoRelation key={relation.name} {...relation} />
        ))}
      </Flex>
    </Flex>
  );
}

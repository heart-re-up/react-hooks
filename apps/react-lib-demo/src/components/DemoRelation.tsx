import { Grid, Text } from "@radix-ui/themes";

export type DemoRelationProps = {
  type: "hook" | "component" | "context(provider/hook)";
  name: string;
  description: string;
};

export default function DemoRelation(props: DemoRelationProps) {
  return (
    <Grid columns="3" gap="2" align="start">
      <Text size="2" weight="bold">
        {props.name}
      </Text>
      <Text size="2" weight="bold">
        {props.type}
      </Text>
      <Text size="1">{props.description}</Text>
    </Grid>
  );
}

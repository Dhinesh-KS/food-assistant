"use client";

import { ComponentSchema, ActionSchema } from './schema';
import { Card } from './base/Card';
import { Row } from './base/Row';
import { Column } from './base/Column';
import { Grid } from './base/Grid';
import { Text } from './base/Text';
import { Title } from './base/Title';
import { Caption } from './base/Caption';
import { Image } from './base/Image';
import { Badge } from './base/Badge';
import { Button } from './base/Button';
import { QuantitySelector } from './base/QuantitySelector';
import { Divider } from './base/Divider';
import { Spacer } from './base/Spacer';
import { Carousel } from './base/Carousel';

interface ComponentRendererProps {
  schema: ComponentSchema;
  onAction?: (action: ActionSchema) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
}

export function ComponentRenderer({ 
  schema, 
  onAction,
  onQuantityChange 
}: ComponentRendererProps) {
  if (!schema || !schema.type) {
    console.error('Invalid schema:', schema);
    return null;
  }

  const { type, props = {}, children } = schema;

  // Recursively render children
  const renderChildren = (childSchemas?: ComponentSchema[]) => {
    if (!childSchemas || !Array.isArray(childSchemas)) return null;
    return childSchemas.map((child, index) => (
      <ComponentRenderer 
        key={index} 
        schema={child} 
        onAction={onAction}
        onQuantityChange={onQuantityChange}
      />
    ));
  };

  // Map component types to React components
  switch (type) {
    case 'Card':
      return (
        <Card {...props}>
          {renderChildren(children)}
        </Card>
      );

    case 'Carousel':
      return (
        <Carousel {...props}>
          {renderChildren(children)}
        </Carousel>
      );

    case 'Grid':
      return (
        <Grid {...props}>
          {renderChildren(children)}
        </Grid>
      );

    case 'Row':
      return (
        <Row {...props}>
          {renderChildren(children)}
        </Row>
      );

    case 'Column':
      return (
        <Column {...props}>
          {renderChildren(children)}
        </Column>
      );

    case 'Text':
      return <Text {...(props as any)} />;

    case 'Title':
      return <Title {...(props as any)} />;

    case 'Caption':
      return <Caption {...(props as any)} />;

    case 'Image':
      return <Image {...(props as any)} />;

    case 'Badge':
      return <Badge {...(props as any)} />;

    case 'Button':
      return <Button {...(props as any)} onAction={onAction} />;

    case 'QuantitySelector':
      return <QuantitySelector {...(props as any)} onChange={onQuantityChange} />;

    case 'Divider':
      return <Divider {...(props as any)} />;

    case 'Spacer':
      return <Spacer {...(props as any)} />;

    default:
      console.warn(`Unknown component type: ${type}`);
      return null;
  }
}

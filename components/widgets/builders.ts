import { ComponentSchema } from '@/types/component';
import { Food, CartItem } from '@/types/food';
import { formatPrice } from '@/lib/utils';

/**
 * Helper functions to build JSON UI schemas from data
 */

export function buildFoodCard(food: Food): ComponentSchema {
  return {
    type: 'Card',
    props: {
      className: 'overflow-hidden hover:shadow-lg transition-shadow w-full max-w-xs h-full flex flex-col',
    },
    children: [
      {
        type: 'Image',
        props: {
          src: `/${food.image}`,
          alt: food.name,
          height: '160px',
          fit: 'cover',
          fallback: '/placeholder-food.svg',
        },
      },
      {
        type: 'Column',
        props: { padding: '12px', gap: '10px', className: 'flex-1 flex flex-col' },
        children: [
          // Header: Title and Price in one row
          {
            type: 'Row',
            props: { justify: 'between', align: 'start', gap: '8px' },
            children: [
              {
                type: 'Title',
                props: { text: food.name, size: 'md', className: 'flex-1' },
              },
              {
                type: 'Text',
                props: {
                  text: formatPrice(food.price),
                  size: 'lg',
                  weight: 'bold',
                  color: 'primary',
                  className: 'flex-shrink-0',
                },
              },
            ],
          },
          // Badges and Serves in one row
          {
            type: 'Row',
            props: { justify: 'between', align: 'center', wrap: true, gap: '6px' },
            children: [
              {
                type: 'Row',
                props: { gap: '4px', wrap: true, className: 'flex-1' },
                children: [
                  ...(food.type === 'Vegetarian'
                    ? [
                        {
                          type: 'Badge' as const,
                          props: {
                            text: 'Veg',
                            variant: 'success',
                            icon: 'leaf',
                          },
                        },
                      ]
                    : []),
                  ...(food.spiceLevel
                    ? [
                        {
                          type: 'Badge' as const,
                          props: {
                            text: food.spiceLevel,
                            variant: 'outline',
                            icon: 'flame',
                          },
                        },
                      ]
                    : []),
                  {
                    type: 'Badge',
                    props: {
                      text: food.category,
                      variant: 'outline',
                    },
                  },
                ],
              },
              {
                type: 'Caption',
                props: { text: `Serves ${food.serves}`, color: 'muted', className: 'whitespace-nowrap' },
              },
            ],
          },
          // Description - shorter
          {
            type: 'Text',
            props: {
              text:
                food.description.length > 80
                  ? food.description.substring(0, 80) + '...'
                  : food.description,
              color: 'secondary',
              size: 'sm',
              className: 'line-clamp-2 flex-1',
            },
          },
          // Nutrition - Inline compact with separators
          {
            type: 'Row',
            props: { gap: '4px', justify: 'around', align: 'center', className: 'py-1.5 px-2 bg-muted/30 rounded text-xs' },
            children: [
              {
                type: 'Text',
                props: {
                  text: `${food.nutrition.calories || '-'} Cal`,
                  size: 'xs',
                  weight: 'semibold',
                },
              },
              {
                type: 'Text',
                props: {
                  text: '•',
                  size: 'xs',
                  color: 'muted',
                },
              },
              {
                type: 'Text',
                props: {
                  text: `${food.nutrition.protein || '-'} P`,
                  size: 'xs',
                  weight: 'semibold',
                },
              },
              {
                type: 'Text',
                props: {
                  text: '•',
                  size: 'xs',
                  color: 'muted',
                },
              },
              {
                type: 'Text',
                props: {
                  text: `${food.nutrition.carbs || '-'} C`,
                  size: 'xs',
                  weight: 'semibold',
                },
              },
              {
                type: 'Text',
                props: {
                  text: '•',
                  size: 'xs',
                  color: 'muted',
                },
              },
              {
                type: 'Text',
                props: {
                  text: `${food.nutrition.fat || '-'} F`,
                  size: 'xs',
                  weight: 'semibold',
                },
              },
            ],
          },
          // Spacer to push buttons to bottom
          {
            type: 'Spacer',
            props: { height: 'auto', className: 'flex-1 min-h-2' },
          },
          // Action Row
          {
            type: 'Row',
            props: { gap: '8px', align: 'center' },
            children: [
              {
                type: 'QuantitySelector',
                props: {
                  id: `qty-${food.id}`,
                  min: 1,
                  max: 10,
                  default: 1,
                },
              },
              {
                type: 'Button',
                props: {
                  text: 'Add to Cart',
                  variant: 'primary',
                  size: 'md',
                  className: 'flex-1',
                  action: {
                    type: 'add_to_cart',
                    payload: {
                      itemId: food.id,
                      name: food.name,
                      price: food.price,
                      image: food.image,
                      serves: food.serves,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

export function buildFoodCarousel(foods: Food[]): ComponentSchema {
  if (foods.length === 0) {
    return buildNoResultsMessage();
  }

  if (foods.length === 1) {
    return buildFoodCard(foods[0]);
  }

  return {
    type: 'Carousel',
    props: {
      showArrows: true,
      showDots: true,
      slidesToShow: 1,
      gap: '12px',
      className: 'mt-4',
    },
    children: foods.map((food) => buildFoodCard(food)),
  };
}

export function buildNoResultsMessage(): ComponentSchema {
  return {
    type: 'Card',
    props: {
      variant: 'subtle',
      padding: '24px',
      className: 'text-center mt-4',
    },
    children: [
      {
        type: 'Text',
        props: {
          text: "I couldn't find any items matching your request. Try asking for something else!",
          color: 'secondary',
        },
      },
    ],
  };
}

export function buildSuggestionsMessage(suggestions: string[]): ComponentSchema {
  return {
    type: 'Card',
    props: {
      variant: 'subtle',
      padding: '16px',
      className: 'mt-4',
    },
    children: [
      {
        type: 'Caption',
        props: {
          text: 'You might also like:',
          weight: 'semibold',
          className: 'mb-2',
        },
      },
      {
        type: 'Row',
        props: { gap: '8px', wrap: true },
        children: suggestions.map((suggestion) => ({
          type: 'Button',
          props: {
            text: suggestion,
            variant: 'outline',
            size: 'sm',
            action: {
              type: 'message',
              payload: { text: suggestion },
            },
          },
        })),
      },
    ],
  };
}

export function buildCartSummary(items: CartItem[], total: number): ComponentSchema {
  return {
    type: 'Card',
    props: {
      variant: 'default',
      padding: '20px',
      className: 'mt-4 border-2 border-primary/30 bg-gradient-to-br from-orange-50/50 to-white shadow-sm',
    },
    children: [
      {
        type: 'Row',
        props: { justify: 'between', align: 'center', className: 'mb-4' },
        children: [
          {
            type: 'Title',
            props: {
              text: '🛒 Cart Summary',
              size: 'lg',
              weight: 'bold',
            },
          },
          {
            type: 'Badge',
            props: {
              text: `${items.length} item${items.length > 1 ? 's' : ''}`,
              variant: 'secondary',
            },
          },
        ],
      },
      {
        type: 'Column',
        props: { gap: '12px', className: 'mb-4' },
        children: items.map((item) => ({
          type: 'Row',
          props: { justify: 'between', align: 'start', className: 'py-2' },
          children: [
            {
              type: 'Column',
              props: { gap: '4px', className: 'flex-1' },
              children: [
                {
                  type: 'Text',
                  props: {
                    text: item.food.name,
                    weight: 'semibold',
                    size: 'base',
                    color: 'primary',
                  },
                },
                {
                  type: 'Text',
                  props: {
                    text: `${formatPrice(item.food.price)} × ${item.quantity}`,
                    size: 'sm',
                    color: 'muted',
                  },
                },
              ],
            },
            {
              type: 'Text',
              props: {
                text: formatPrice(item.food.price * item.quantity),
                weight: 'bold',
                size: 'base',
                color: 'primary',
              },
            },
          ],
        })),
      },
      {
        type: 'Divider',
        props: { className: 'my-4' },
      },
      {
        type: 'Row',
        props: { justify: 'between', align: 'center', className: 'mb-4' },
        children: [
          {
            type: 'Text',
            props: {
              text: 'Total',
              weight: 'bold',
              size: 'xl',
            },
          },
          {
            type: 'Text',
            props: {
              text: formatPrice(total),
              weight: 'bold',
              size: '2xl',
              color: 'primary',
            },
          },
        ],
      },
      {
        type: 'Button',
        props: {
          text: '🛍️ Proceed to Checkout',
          variant: 'primary',
          size: 'lg',
          className: 'w-full',
          action: {
            type: 'navigate',
            payload: { url: '/cart' },
          },
        },
      },
    ],
  };
}

import { NextResponse } from 'next/server';
import { Order } from '@/types/history';

const orders: any[] = [];

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order: Order = {
      id: orderId,
      userId: orderData.userId,
      conversationId: orderData.conversationId, // Link to conversation
      items: orderData.items,
      total: orderData.total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      deliveryAddress: orderData.deliveryAddress,
      deliveryInstructions: orderData.deliveryInstructions,
      estimatedDeliveryTime: '30-45 minutes',
    };
    
    orders.push(order);
    
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to place order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    orders,
  });
}

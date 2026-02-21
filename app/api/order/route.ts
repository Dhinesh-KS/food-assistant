import { NextResponse } from 'next/server';

const orders: any[] = [];

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      status: 'confirmed',
      estimatedDelivery: '30-45 minutes',
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

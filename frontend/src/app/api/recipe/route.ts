import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { RAG_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Forward the request to the external RAG server
        const response = await axios.post(`${RAG_URL}/api/recipe`, body);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("RAG Recipe Proxy Error:", error.message);
        return NextResponse.json(
            { error: 'Failed to fetch recipe from RAG server' },
            { status: error.response?.status || 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { RAG_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Forward the request to the external RAG server
        // This runs on the server, so no CORS issues
        const response = await axios.post(`${RAG_URL}/api/video`, body);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("RAG Proxy Error:", error.message);
        return NextResponse.json(
            { error: 'Failed to fetch from RAG server' },
            { status: error.response?.status || 500 }
        );
    }
}

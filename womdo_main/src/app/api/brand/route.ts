import { connectToDb } from '@/database/connect';
import Brand from '@/database/models/brandModel';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        await connectToDb()
        const reqObj = await req.json();
        console.log('reqObj', reqObj);

        const newPrompt = new Brand(reqObj);
        console.log('newPrompt', newPrompt);
        await newPrompt.save();
        return NextResponse.json({ status: true, message: "Brand Details Saved Successfully", data: newPrompt }, { status: 201 })
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({ status: false, message: error.message }, { status: 500 })
    }
}
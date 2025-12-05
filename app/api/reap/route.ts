import { NextRequest, NextResponse } from 'next/server';
import { validateGitHubUrl } from '@/lib/validators';
import { analyzeRepository } from '@/lib/git/analyzer';
import {
  ReapRequest,
  ReapSuccessResponse,
  ReapErrorResponse,
} from '@/lib/types';

/**
 * POST /api/reap
 * Analyzes a GitHub repository to find dead branches (merged but not deleted)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      const errorResponse: ReapErrorResponse = {
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if githubUrl field is present
    if (!body || typeof body !== 'object' || !('githubUrl' in body)) {
      const errorResponse: ReapErrorResponse = {
        error: 'Missing required field: githubUrl',
        code: 'MISSING_FIELD',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { githubUrl, githubToken } = body as ReapRequest & { githubToken?: string };

    // Validate GitHub URL
    const validationResult = validateGitHubUrl(githubUrl);
    if (!validationResult.isValid) {
      const errorResponse: ReapErrorResponse = {
        error: validationResult.error || 'Invalid GitHub URL',
        code: 'INVALID_URL',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let tokenUsed = 'none';
        
        // Adaptive timeout: base 3 minutes, automatically extends based on branch count
        const baseTimeout = 180000; // 3 minutes
        
        // Try without token first (GitHub's free 60 requests)
        let analysisResult = await analyzeRepository({
          repoUrl: githubUrl,
          timeout: baseTimeout,
          adaptiveTimeout: true, // Enable automatic timeout extension
          githubToken: githubToken || undefined,
          onProgress: (current, total, found, status) => {
            const progressData = JSON.stringify({
              type: 'progress',
              current,
              total,
              found,
              status
            });
            controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
          }
        });

        } else if (githubToken) {
          tokenUsed = 'user';
        }

        // Check if analysis encountered an error
        if (analysisResult.error) {
          const errorData = JSON.stringify({
            type: 'error',
            error: analysisResult.error.message,
            code: analysisResult.error.code,
            tokenUsed
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } else {
          // Send completion data
          const completeData = JSON.stringify({
            type: 'complete',
            deadBranches: analysisResult.deadBranches || [],
            repositoryUrl: githubUrl,
            analyzedAt: new Date().toISOString(),
            tokenUsed
          });
          controller.enqueue(encoder.encode(`data: ${completeData}\n\n`));
        }

        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    // Handle unexpected errors
    const errorResponse: ReapErrorResponse = {
      error: 'An unexpected error occurred during analysis',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : String(error),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

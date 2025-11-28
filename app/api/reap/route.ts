import { NextRequest, NextResponse } from 'next/server';
import { validateGitHubUrl } from '@/lib/validators';
import { analyzeRepository } from '@/lib/git/analyzer';
import { cleanupTempDirectory } from '@/lib/git/cleanup';
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
  let tempDir: string | null = null;

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

    const { githubUrl } = body as ReapRequest;

    // Validate GitHub URL
    const validationResult = validateGitHubUrl(githubUrl);
    if (!validationResult.isValid) {
      const errorResponse: ReapErrorResponse = {
        error: validationResult.error || 'Invalid GitHub URL',
        code: 'INVALID_URL',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Analyze the repository
    const analysisResult = await analyzeRepository({
      repoUrl: githubUrl,
      timeout: 90000, // 90 seconds
    });

    tempDir = analysisResult.tempDir;

    // Check if analysis encountered an error
    if (analysisResult.error) {
      const { message, code } = analysisResult.error;
      
      // Map error codes to appropriate HTTP status codes
      let statusCode = 500;
      if (code === 'TIMEOUT') {
        statusCode = 408;
      } else if (message.includes('not found') || message.includes('does not exist')) {
        statusCode = 404;
      } else if (message.includes('No main branch found')) {
        statusCode = 400;
      }

      const errorResponse: ReapErrorResponse = {
        error: message,
        code: code,
      };
      return NextResponse.json(errorResponse, { status: statusCode });
    }

    // Format success response
    const successResponse: ReapSuccessResponse = {
      deadBranches: analysisResult.deadBranches || [],
      repositoryUrl: githubUrl,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    const errorResponse: ReapErrorResponse = {
      error: 'An unexpected error occurred during analysis',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : String(error),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    // Ensure cleanup happens regardless of success or failure
    if (tempDir) {
      try {
        await cleanupTempDirectory(tempDir);
      } catch (cleanupError) {
        // Log cleanup errors but don't fail the request
        console.error('Failed to cleanup temporary directory:', cleanupError);
      }
    }
  }
}

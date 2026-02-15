
import { z } from 'zod';

export interface RunContext {
    userId: string;
    memory: any; // MemoryManager instance
    scorer: any; // KoreScorer instance
    logger: (msg: string) => void;
}

export interface Skill<Input = any, Output = any> {
    name: string;
    description: string;
    inputSchema: z.ZodType<Input>;
    outputSchema: z.ZodType<Output>;
    run: (context: RunContext, input: Input) => Promise<Output>;
}

export interface ChainStep {
    skill: Skill;
    inputMap?: (prevResult: any) => any;
}

export class SkillRunner {
    private context: RunContext;

    constructor(context: RunContext) {
        this.context = context;
    }

    /**
     * Execute a single skill
     */
    public async execute<I, O>(skill: Skill<I, O>, input: I): Promise<O> {
        this.context.logger(`[SkillRunner] Executing skill: ${skill.name}...`);

        // Validate input
        const parseResult = skill.inputSchema.safeParse(input);
        if (!parseResult.success) {
            throw new Error(`Invalid input for skill ${skill.name}: ${parseResult.error.message}`);
        }

        try {
            const start = Date.now();
            const result = await skill.run(this.context, parseResult.data);
            const duration = Date.now() - start;

            this.context.logger(`[SkillRunner] Skill ${skill.name} completed in ${duration}ms`);

            // Validate output
            const outputParse = skill.outputSchema.safeParse(result);
            if (!outputParse.success) {
                throw new Error(`Invalid output from skill ${skill.name}: ${outputParse.error.message}`);
            }

            return outputParse.data;
        } catch (e: any) {
            this.context.logger(`[SkillRunner] Error in skill ${skill.name}: ${e.message}`);
            throw e;
        }
    }

    /**
     * Execute a chain of skills, piping output from one to the next
     */
    public async chain(skills: Skill[], initialInput: any): Promise<any> {
        this.context.logger(`[SkillRunner] Starting chain execution with ${skills.length} skills`);

        let currentInput = initialInput;

        for (const [index, skill] of skills.entries()) {
            this.context.logger(`[SkillRunner] Step ${index + 1}/${skills.length}: ${skill.name}`);
            currentInput = await this.execute(skill, currentInput);
        }

        this.context.logger(`[SkillRunner] Chain execution completed`);
        return currentInput;
    }
}

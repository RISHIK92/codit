
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Projects
 * 
 */
export type Projects = $Result.DefaultSelection<Prisma.$ProjectsPayload>
/**
 * Model Deliverable
 * 
 */
export type Deliverable = $Result.DefaultSelection<Prisma.$DeliverablePayload>
/**
 * Model EntranceQuestion
 * 
 */
export type EntranceQuestion = $Result.DefaultSelection<Prisma.$EntranceQuestionPayload>
/**
 * Model EntranceTestAttempt
 * 
 */
export type EntranceTestAttempt = $Result.DefaultSelection<Prisma.$EntranceTestAttemptPayload>
/**
 * Model ProjectFile
 * 
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>
/**
 * Model UserProjects
 * 
 */
export type UserProjects = $Result.DefaultSelection<Prisma.$UserProjectsPayload>
/**
 * Model LearningPhase
 * 
 */
export type LearningPhase = $Result.DefaultSelection<Prisma.$LearningPhasePayload>
/**
 * Model KnowledgeChecks
 * 
 */
export type KnowledgeChecks = $Result.DefaultSelection<Prisma.$KnowledgeChecksPayload>
/**
 * Model Resources
 * 
 */
export type Resources = $Result.DefaultSelection<Prisma.$ResourcesPayload>
/**
 * Model ResourceProgress
 * 
 */
export type ResourceProgress = $Result.DefaultSelection<Prisma.$ResourceProgressPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Skill_Level: {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced'
};

export type Skill_Level = (typeof Skill_Level)[keyof typeof Skill_Level]


export const Status: {
  in_progress: 'in_progress',
  completed: 'completed',
  abandoned: 'abandoned'
};

export type Status = (typeof Status)[keyof typeof Status]


export const Question_Type: {
  code_completion: 'code_completion',
  multiple_choice: 'multiple_choice',
  debug: 'debug'
};

export type Question_Type = (typeof Question_Type)[keyof typeof Question_Type]


export const Difficulty: {
  easy: 'easy',
  intermediate: 'intermediate',
  advanced: 'advanced'
};

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]


export const TestStatus: {
  in_progress: 'in_progress',
  completed: 'completed'
};

export type TestStatus = (typeof TestStatus)[keyof typeof TestStatus]


export const PhaseStatus: {
  in_progress: 'in_progress',
  completed: 'completed',
  locked: 'locked'
};

export type PhaseStatus = (typeof PhaseStatus)[keyof typeof PhaseStatus]

}

export type Skill_Level = $Enums.Skill_Level

export const Skill_Level: typeof $Enums.Skill_Level

export type Status = $Enums.Status

export const Status: typeof $Enums.Status

export type Question_Type = $Enums.Question_Type

export const Question_Type: typeof $Enums.Question_Type

export type Difficulty = $Enums.Difficulty

export const Difficulty: typeof $Enums.Difficulty

export type TestStatus = $Enums.TestStatus

export const TestStatus: typeof $Enums.TestStatus

export type PhaseStatus = $Enums.PhaseStatus

export const PhaseStatus: typeof $Enums.PhaseStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projects`: Exposes CRUD operations for the **Projects** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.projects.findMany()
    * ```
    */
  get projects(): Prisma.ProjectsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deliverable`: Exposes CRUD operations for the **Deliverable** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Deliverables
    * const deliverables = await prisma.deliverable.findMany()
    * ```
    */
  get deliverable(): Prisma.DeliverableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.entranceQuestion`: Exposes CRUD operations for the **EntranceQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EntranceQuestions
    * const entranceQuestions = await prisma.entranceQuestion.findMany()
    * ```
    */
  get entranceQuestion(): Prisma.EntranceQuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.entranceTestAttempt`: Exposes CRUD operations for the **EntranceTestAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EntranceTestAttempts
    * const entranceTestAttempts = await prisma.entranceTestAttempt.findMany()
    * ```
    */
  get entranceTestAttempt(): Prisma.EntranceTestAttemptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFiles
    * const projectFiles = await prisma.projectFile.findMany()
    * ```
    */
  get projectFile(): Prisma.ProjectFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProjects`: Exposes CRUD operations for the **UserProjects** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProjects
    * const userProjects = await prisma.userProjects.findMany()
    * ```
    */
  get userProjects(): Prisma.UserProjectsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.learningPhase`: Exposes CRUD operations for the **LearningPhase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LearningPhases
    * const learningPhases = await prisma.learningPhase.findMany()
    * ```
    */
  get learningPhase(): Prisma.LearningPhaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.knowledgeChecks`: Exposes CRUD operations for the **KnowledgeChecks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KnowledgeChecks
    * const knowledgeChecks = await prisma.knowledgeChecks.findMany()
    * ```
    */
  get knowledgeChecks(): Prisma.KnowledgeChecksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resources`: Exposes CRUD operations for the **Resources** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resources
    * const resources = await prisma.resources.findMany()
    * ```
    */
  get resources(): Prisma.ResourcesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resourceProgress`: Exposes CRUD operations for the **ResourceProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResourceProgresses
    * const resourceProgresses = await prisma.resourceProgress.findMany()
    * ```
    */
  get resourceProgress(): Prisma.ResourceProgressDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Projects: 'Projects',
    Deliverable: 'Deliverable',
    EntranceQuestion: 'EntranceQuestion',
    EntranceTestAttempt: 'EntranceTestAttempt',
    ProjectFile: 'ProjectFile',
    UserProjects: 'UserProjects',
    LearningPhase: 'LearningPhase',
    KnowledgeChecks: 'KnowledgeChecks',
    Resources: 'Resources',
    ResourceProgress: 'ResourceProgress'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "projects" | "deliverable" | "entranceQuestion" | "entranceTestAttempt" | "projectFile" | "userProjects" | "learningPhase" | "knowledgeChecks" | "resources" | "resourceProgress"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Projects: {
        payload: Prisma.$ProjectsPayload<ExtArgs>
        fields: Prisma.ProjectsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>
          }
          findFirst: {
            args: Prisma.ProjectsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>
          }
          findMany: {
            args: Prisma.ProjectsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>[]
          }
          create: {
            args: Prisma.ProjectsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>
          }
          createMany: {
            args: Prisma.ProjectsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>[]
          }
          delete: {
            args: Prisma.ProjectsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>
          }
          update: {
            args: Prisma.ProjectsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>
          }
          deleteMany: {
            args: Prisma.ProjectsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>[]
          }
          upsert: {
            args: Prisma.ProjectsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectsPayload>
          }
          aggregate: {
            args: Prisma.ProjectsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjects>
          }
          groupBy: {
            args: Prisma.ProjectsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectsCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectsCountAggregateOutputType> | number
          }
        }
      }
      Deliverable: {
        payload: Prisma.$DeliverablePayload<ExtArgs>
        fields: Prisma.DeliverableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeliverableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeliverableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>
          }
          findFirst: {
            args: Prisma.DeliverableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeliverableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>
          }
          findMany: {
            args: Prisma.DeliverableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>[]
          }
          create: {
            args: Prisma.DeliverableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>
          }
          createMany: {
            args: Prisma.DeliverableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeliverableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>[]
          }
          delete: {
            args: Prisma.DeliverableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>
          }
          update: {
            args: Prisma.DeliverableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>
          }
          deleteMany: {
            args: Prisma.DeliverableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeliverableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeliverableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>[]
          }
          upsert: {
            args: Prisma.DeliverableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliverablePayload>
          }
          aggregate: {
            args: Prisma.DeliverableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeliverable>
          }
          groupBy: {
            args: Prisma.DeliverableGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeliverableGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeliverableCountArgs<ExtArgs>
            result: $Utils.Optional<DeliverableCountAggregateOutputType> | number
          }
        }
      }
      EntranceQuestion: {
        payload: Prisma.$EntranceQuestionPayload<ExtArgs>
        fields: Prisma.EntranceQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EntranceQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EntranceQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>
          }
          findFirst: {
            args: Prisma.EntranceQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EntranceQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>
          }
          findMany: {
            args: Prisma.EntranceQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>[]
          }
          create: {
            args: Prisma.EntranceQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>
          }
          createMany: {
            args: Prisma.EntranceQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EntranceQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>[]
          }
          delete: {
            args: Prisma.EntranceQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>
          }
          update: {
            args: Prisma.EntranceQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>
          }
          deleteMany: {
            args: Prisma.EntranceQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EntranceQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EntranceQuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>[]
          }
          upsert: {
            args: Prisma.EntranceQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceQuestionPayload>
          }
          aggregate: {
            args: Prisma.EntranceQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEntranceQuestion>
          }
          groupBy: {
            args: Prisma.EntranceQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<EntranceQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.EntranceQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<EntranceQuestionCountAggregateOutputType> | number
          }
        }
      }
      EntranceTestAttempt: {
        payload: Prisma.$EntranceTestAttemptPayload<ExtArgs>
        fields: Prisma.EntranceTestAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EntranceTestAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EntranceTestAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>
          }
          findFirst: {
            args: Prisma.EntranceTestAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EntranceTestAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>
          }
          findMany: {
            args: Prisma.EntranceTestAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>[]
          }
          create: {
            args: Prisma.EntranceTestAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>
          }
          createMany: {
            args: Prisma.EntranceTestAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EntranceTestAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>[]
          }
          delete: {
            args: Prisma.EntranceTestAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>
          }
          update: {
            args: Prisma.EntranceTestAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>
          }
          deleteMany: {
            args: Prisma.EntranceTestAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EntranceTestAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EntranceTestAttemptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>[]
          }
          upsert: {
            args: Prisma.EntranceTestAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntranceTestAttemptPayload>
          }
          aggregate: {
            args: Prisma.EntranceTestAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEntranceTestAttempt>
          }
          groupBy: {
            args: Prisma.EntranceTestAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<EntranceTestAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.EntranceTestAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<EntranceTestAttemptCountAggregateOutputType> | number
          }
        }
      }
      ProjectFile: {
        payload: Prisma.$ProjectFilePayload<ExtArgs>
        fields: Prisma.ProjectFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findFirst: {
            args: Prisma.ProjectFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findMany: {
            args: Prisma.ProjectFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          create: {
            args: Prisma.ProjectFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          createMany: {
            args: Prisma.ProjectFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          delete: {
            args: Prisma.ProjectFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          update: {
            args: Prisma.ProjectFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          deleteMany: {
            args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          upsert: {
            args: Prisma.ProjectFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          aggregate: {
            args: Prisma.ProjectFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFile>
          }
          groupBy: {
            args: Prisma.ProjectFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFileCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileCountAggregateOutputType> | number
          }
        }
      }
      UserProjects: {
        payload: Prisma.$UserProjectsPayload<ExtArgs>
        fields: Prisma.UserProjectsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProjectsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProjectsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>
          }
          findFirst: {
            args: Prisma.UserProjectsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProjectsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>
          }
          findMany: {
            args: Prisma.UserProjectsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>[]
          }
          create: {
            args: Prisma.UserProjectsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>
          }
          createMany: {
            args: Prisma.UserProjectsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProjectsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>[]
          }
          delete: {
            args: Prisma.UserProjectsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>
          }
          update: {
            args: Prisma.UserProjectsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>
          }
          deleteMany: {
            args: Prisma.UserProjectsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProjectsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProjectsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>[]
          }
          upsert: {
            args: Prisma.UserProjectsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProjectsPayload>
          }
          aggregate: {
            args: Prisma.UserProjectsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProjects>
          }
          groupBy: {
            args: Prisma.UserProjectsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProjectsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProjectsCountArgs<ExtArgs>
            result: $Utils.Optional<UserProjectsCountAggregateOutputType> | number
          }
        }
      }
      LearningPhase: {
        payload: Prisma.$LearningPhasePayload<ExtArgs>
        fields: Prisma.LearningPhaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LearningPhaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LearningPhaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>
          }
          findFirst: {
            args: Prisma.LearningPhaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LearningPhaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>
          }
          findMany: {
            args: Prisma.LearningPhaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>[]
          }
          create: {
            args: Prisma.LearningPhaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>
          }
          createMany: {
            args: Prisma.LearningPhaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LearningPhaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>[]
          }
          delete: {
            args: Prisma.LearningPhaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>
          }
          update: {
            args: Prisma.LearningPhaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>
          }
          deleteMany: {
            args: Prisma.LearningPhaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LearningPhaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LearningPhaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>[]
          }
          upsert: {
            args: Prisma.LearningPhaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LearningPhasePayload>
          }
          aggregate: {
            args: Prisma.LearningPhaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLearningPhase>
          }
          groupBy: {
            args: Prisma.LearningPhaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<LearningPhaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.LearningPhaseCountArgs<ExtArgs>
            result: $Utils.Optional<LearningPhaseCountAggregateOutputType> | number
          }
        }
      }
      KnowledgeChecks: {
        payload: Prisma.$KnowledgeChecksPayload<ExtArgs>
        fields: Prisma.KnowledgeChecksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KnowledgeChecksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KnowledgeChecksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>
          }
          findFirst: {
            args: Prisma.KnowledgeChecksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KnowledgeChecksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>
          }
          findMany: {
            args: Prisma.KnowledgeChecksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>[]
          }
          create: {
            args: Prisma.KnowledgeChecksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>
          }
          createMany: {
            args: Prisma.KnowledgeChecksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KnowledgeChecksCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>[]
          }
          delete: {
            args: Prisma.KnowledgeChecksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>
          }
          update: {
            args: Prisma.KnowledgeChecksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>
          }
          deleteMany: {
            args: Prisma.KnowledgeChecksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KnowledgeChecksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KnowledgeChecksUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>[]
          }
          upsert: {
            args: Prisma.KnowledgeChecksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeChecksPayload>
          }
          aggregate: {
            args: Prisma.KnowledgeChecksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKnowledgeChecks>
          }
          groupBy: {
            args: Prisma.KnowledgeChecksGroupByArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeChecksGroupByOutputType>[]
          }
          count: {
            args: Prisma.KnowledgeChecksCountArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeChecksCountAggregateOutputType> | number
          }
        }
      }
      Resources: {
        payload: Prisma.$ResourcesPayload<ExtArgs>
        fields: Prisma.ResourcesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResourcesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResourcesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>
          }
          findFirst: {
            args: Prisma.ResourcesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResourcesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>
          }
          findMany: {
            args: Prisma.ResourcesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>[]
          }
          create: {
            args: Prisma.ResourcesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>
          }
          createMany: {
            args: Prisma.ResourcesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResourcesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>[]
          }
          delete: {
            args: Prisma.ResourcesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>
          }
          update: {
            args: Prisma.ResourcesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>
          }
          deleteMany: {
            args: Prisma.ResourcesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResourcesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResourcesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>[]
          }
          upsert: {
            args: Prisma.ResourcesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourcesPayload>
          }
          aggregate: {
            args: Prisma.ResourcesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResources>
          }
          groupBy: {
            args: Prisma.ResourcesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResourcesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResourcesCountArgs<ExtArgs>
            result: $Utils.Optional<ResourcesCountAggregateOutputType> | number
          }
        }
      }
      ResourceProgress: {
        payload: Prisma.$ResourceProgressPayload<ExtArgs>
        fields: Prisma.ResourceProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResourceProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResourceProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>
          }
          findFirst: {
            args: Prisma.ResourceProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResourceProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>
          }
          findMany: {
            args: Prisma.ResourceProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>[]
          }
          create: {
            args: Prisma.ResourceProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>
          }
          createMany: {
            args: Prisma.ResourceProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResourceProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>[]
          }
          delete: {
            args: Prisma.ResourceProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>
          }
          update: {
            args: Prisma.ResourceProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>
          }
          deleteMany: {
            args: Prisma.ResourceProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResourceProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResourceProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>[]
          }
          upsert: {
            args: Prisma.ResourceProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResourceProgressPayload>
          }
          aggregate: {
            args: Prisma.ResourceProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResourceProgress>
          }
          groupBy: {
            args: Prisma.ResourceProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResourceProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResourceProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ResourceProgressCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    projects?: ProjectsOmit
    deliverable?: DeliverableOmit
    entranceQuestion?: EntranceQuestionOmit
    entranceTestAttempt?: EntranceTestAttemptOmit
    projectFile?: ProjectFileOmit
    userProjects?: UserProjectsOmit
    learningPhase?: LearningPhaseOmit
    knowledgeChecks?: KnowledgeChecksOmit
    resources?: ResourcesOmit
    resourceProgress?: ResourceProgressOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    userProjects: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProjects?: boolean | UserCountOutputTypeCountUserProjectsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProjectsWhereInput
  }


  /**
   * Count Type ProjectsCountOutputType
   */

  export type ProjectsCountOutputType = {
    learningPhases: number
    userProjects: number
    deliverables: number
  }

  export type ProjectsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhases?: boolean | ProjectsCountOutputTypeCountLearningPhasesArgs
    userProjects?: boolean | ProjectsCountOutputTypeCountUserProjectsArgs
    deliverables?: boolean | ProjectsCountOutputTypeCountDeliverablesArgs
  }

  // Custom InputTypes
  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectsCountOutputType
     */
    select?: ProjectsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountLearningPhasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LearningPhaseWhereInput
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountUserProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProjectsWhereInput
  }

  /**
   * ProjectsCountOutputType without action
   */
  export type ProjectsCountOutputTypeCountDeliverablesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliverableWhereInput
  }


  /**
   * Count Type UserProjectsCountOutputType
   */

  export type UserProjectsCountOutputType = {
    projectFiles: number
  }

  export type UserProjectsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projectFiles?: boolean | UserProjectsCountOutputTypeCountProjectFilesArgs
  }

  // Custom InputTypes
  /**
   * UserProjectsCountOutputType without action
   */
  export type UserProjectsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjectsCountOutputType
     */
    select?: UserProjectsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserProjectsCountOutputType without action
   */
  export type UserProjectsCountOutputTypeCountProjectFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }


  /**
   * Count Type LearningPhaseCountOutputType
   */

  export type LearningPhaseCountOutputType = {
    resources: number
    knowledgeChecks: number
  }

  export type LearningPhaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resources?: boolean | LearningPhaseCountOutputTypeCountResourcesArgs
    knowledgeChecks?: boolean | LearningPhaseCountOutputTypeCountKnowledgeChecksArgs
  }

  // Custom InputTypes
  /**
   * LearningPhaseCountOutputType without action
   */
  export type LearningPhaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhaseCountOutputType
     */
    select?: LearningPhaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LearningPhaseCountOutputType without action
   */
  export type LearningPhaseCountOutputTypeCountResourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResourcesWhereInput
  }

  /**
   * LearningPhaseCountOutputType without action
   */
  export type LearningPhaseCountOutputTypeCountKnowledgeChecksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeChecksWhereInput
  }


  /**
   * Count Type ResourcesCountOutputType
   */

  export type ResourcesCountOutputType = {
    userProgress: number
  }

  export type ResourcesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProgress?: boolean | ResourcesCountOutputTypeCountUserProgressArgs
  }

  // Custom InputTypes
  /**
   * ResourcesCountOutputType without action
   */
  export type ResourcesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourcesCountOutputType
     */
    select?: ResourcesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResourcesCountOutputType without action
   */
  export type ResourcesCountOutputTypeCountUserProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResourceProgressWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    hoursPerWeek: number | null
  }

  export type UserSumAggregateOutputType = {
    hoursPerWeek: number | null
  }

  export type UserMinAggregateOutputType = {
    uid: string | null
    email: string | null
    skillLevel: $Enums.Skill_Level | null
    hoursPerWeek: number | null
    name: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    uid: string | null
    email: string | null
    skillLevel: $Enums.Skill_Level | null
    hoursPerWeek: number | null
    name: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    uid: number
    email: number
    skillLevel: number
    learningModes: number
    hoursPerWeek: number
    name: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    hoursPerWeek?: true
  }

  export type UserSumAggregateInputType = {
    hoursPerWeek?: true
  }

  export type UserMinAggregateInputType = {
    uid?: true
    email?: true
    skillLevel?: true
    hoursPerWeek?: true
    name?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    uid?: true
    email?: true
    skillLevel?: true
    hoursPerWeek?: true
    name?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    uid?: true
    email?: true
    skillLevel?: true
    learningModes?: true
    hoursPerWeek?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    uid: string
    email: string
    skillLevel: $Enums.Skill_Level | null
    learningModes: string[]
    hoursPerWeek: number | null
    name: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uid?: boolean
    email?: boolean
    skillLevel?: boolean
    learningModes?: boolean
    hoursPerWeek?: boolean
    name?: boolean
    createdAt?: boolean
    userProjects?: boolean | User$userProjectsArgs<ExtArgs>
    entranceTestAttempt?: boolean | User$entranceTestAttemptArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uid?: boolean
    email?: boolean
    skillLevel?: boolean
    learningModes?: boolean
    hoursPerWeek?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uid?: boolean
    email?: boolean
    skillLevel?: boolean
    learningModes?: boolean
    hoursPerWeek?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    uid?: boolean
    email?: boolean
    skillLevel?: boolean
    learningModes?: boolean
    hoursPerWeek?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"uid" | "email" | "skillLevel" | "learningModes" | "hoursPerWeek" | "name" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProjects?: boolean | User$userProjectsArgs<ExtArgs>
    entranceTestAttempt?: boolean | User$entranceTestAttemptArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      userProjects: Prisma.$UserProjectsPayload<ExtArgs>[]
      entranceTestAttempt: Prisma.$EntranceTestAttemptPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      uid: string
      email: string
      skillLevel: $Enums.Skill_Level | null
      learningModes: string[]
      hoursPerWeek: number | null
      name: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `uid`
     * const userWithUidOnly = await prisma.user.findMany({ select: { uid: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `uid`
     * const userWithUidOnly = await prisma.user.createManyAndReturn({
     *   select: { uid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `uid`
     * const userWithUidOnly = await prisma.user.updateManyAndReturn({
     *   select: { uid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userProjects<T extends User$userProjectsArgs<ExtArgs> = {}>(args?: Subset<T, User$userProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    entranceTestAttempt<T extends User$entranceTestAttemptArgs<ExtArgs> = {}>(args?: Subset<T, User$entranceTestAttemptArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly uid: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly skillLevel: FieldRef<"User", 'Skill_Level'>
    readonly learningModes: FieldRef<"User", 'String[]'>
    readonly hoursPerWeek: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.userProjects
   */
  export type User$userProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    where?: UserProjectsWhereInput
    orderBy?: UserProjectsOrderByWithRelationInput | UserProjectsOrderByWithRelationInput[]
    cursor?: UserProjectsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProjectsScalarFieldEnum | UserProjectsScalarFieldEnum[]
  }

  /**
   * User.entranceTestAttempt
   */
  export type User$entranceTestAttemptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    where?: EntranceTestAttemptWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Projects
   */

  export type AggregateProjects = {
    _count: ProjectsCountAggregateOutputType | null
    _avg: ProjectsAvgAggregateOutputType | null
    _sum: ProjectsSumAggregateOutputType | null
    _min: ProjectsMinAggregateOutputType | null
    _max: ProjectsMaxAggregateOutputType | null
  }

  export type ProjectsAvgAggregateOutputType = {
    estimated_minutes: number | null
  }

  export type ProjectsSumAggregateOutputType = {
    estimated_minutes: number | null
  }

  export type ProjectsMinAggregateOutputType = {
    id: string | null
    name: string | null
    skill_level: $Enums.Skill_Level | null
    goal: string | null
    demo_url: string | null
    estimated_minutes: number | null
    createdAt: Date | null
  }

  export type ProjectsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    skill_level: $Enums.Skill_Level | null
    goal: string | null
    demo_url: string | null
    estimated_minutes: number | null
    createdAt: Date | null
  }

  export type ProjectsCountAggregateOutputType = {
    id: number
    name: number
    tech_stack: number
    skill_level: number
    goal: number
    demo_url: number
    estimated_minutes: number
    initial_files: number
    createdAt: number
    _all: number
  }


  export type ProjectsAvgAggregateInputType = {
    estimated_minutes?: true
  }

  export type ProjectsSumAggregateInputType = {
    estimated_minutes?: true
  }

  export type ProjectsMinAggregateInputType = {
    id?: true
    name?: true
    skill_level?: true
    goal?: true
    demo_url?: true
    estimated_minutes?: true
    createdAt?: true
  }

  export type ProjectsMaxAggregateInputType = {
    id?: true
    name?: true
    skill_level?: true
    goal?: true
    demo_url?: true
    estimated_minutes?: true
    createdAt?: true
  }

  export type ProjectsCountAggregateInputType = {
    id?: true
    name?: true
    tech_stack?: true
    skill_level?: true
    goal?: true
    demo_url?: true
    estimated_minutes?: true
    initial_files?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to aggregate.
     */
    where?: ProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectsOrderByWithRelationInput | ProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectsMaxAggregateInputType
  }

  export type GetProjectsAggregateType<T extends ProjectsAggregateArgs> = {
        [P in keyof T & keyof AggregateProjects]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjects[P]>
      : GetScalarType<T[P], AggregateProjects[P]>
  }




  export type ProjectsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectsWhereInput
    orderBy?: ProjectsOrderByWithAggregationInput | ProjectsOrderByWithAggregationInput[]
    by: ProjectsScalarFieldEnum[] | ProjectsScalarFieldEnum
    having?: ProjectsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectsCountAggregateInputType | true
    _avg?: ProjectsAvgAggregateInputType
    _sum?: ProjectsSumAggregateInputType
    _min?: ProjectsMinAggregateInputType
    _max?: ProjectsMaxAggregateInputType
  }

  export type ProjectsGroupByOutputType = {
    id: string
    name: string
    tech_stack: string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url: string | null
    estimated_minutes: number
    initial_files: JsonValue | null
    createdAt: Date
    _count: ProjectsCountAggregateOutputType | null
    _avg: ProjectsAvgAggregateOutputType | null
    _sum: ProjectsSumAggregateOutputType | null
    _min: ProjectsMinAggregateOutputType | null
    _max: ProjectsMaxAggregateOutputType | null
  }

  type GetProjectsGroupByPayload<T extends ProjectsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectsGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectsGroupByOutputType[P]>
        }
      >
    >


  export type ProjectsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    tech_stack?: boolean
    skill_level?: boolean
    goal?: boolean
    demo_url?: boolean
    estimated_minutes?: boolean
    initial_files?: boolean
    createdAt?: boolean
    learningPhases?: boolean | Projects$learningPhasesArgs<ExtArgs>
    userProjects?: boolean | Projects$userProjectsArgs<ExtArgs>
    deliverables?: boolean | Projects$deliverablesArgs<ExtArgs>
    _count?: boolean | ProjectsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projects"]>

  export type ProjectsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    tech_stack?: boolean
    skill_level?: boolean
    goal?: boolean
    demo_url?: boolean
    estimated_minutes?: boolean
    initial_files?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["projects"]>

  export type ProjectsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    tech_stack?: boolean
    skill_level?: boolean
    goal?: boolean
    demo_url?: boolean
    estimated_minutes?: boolean
    initial_files?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["projects"]>

  export type ProjectsSelectScalar = {
    id?: boolean
    name?: boolean
    tech_stack?: boolean
    skill_level?: boolean
    goal?: boolean
    demo_url?: boolean
    estimated_minutes?: boolean
    initial_files?: boolean
    createdAt?: boolean
  }

  export type ProjectsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "tech_stack" | "skill_level" | "goal" | "demo_url" | "estimated_minutes" | "initial_files" | "createdAt", ExtArgs["result"]["projects"]>
  export type ProjectsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhases?: boolean | Projects$learningPhasesArgs<ExtArgs>
    userProjects?: boolean | Projects$userProjectsArgs<ExtArgs>
    deliverables?: boolean | Projects$deliverablesArgs<ExtArgs>
    _count?: boolean | ProjectsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProjectsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Projects"
    objects: {
      learningPhases: Prisma.$LearningPhasePayload<ExtArgs>[]
      userProjects: Prisma.$UserProjectsPayload<ExtArgs>[]
      deliverables: Prisma.$DeliverablePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      tech_stack: string[]
      skill_level: $Enums.Skill_Level
      goal: string
      demo_url: string | null
      estimated_minutes: number
      initial_files: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["projects"]>
    composites: {}
  }

  type ProjectsGetPayload<S extends boolean | null | undefined | ProjectsDefaultArgs> = $Result.GetResult<Prisma.$ProjectsPayload, S>

  type ProjectsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectsCountAggregateInputType | true
    }

  export interface ProjectsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Projects'], meta: { name: 'Projects' } }
    /**
     * Find zero or one Projects that matches the filter.
     * @param {ProjectsFindUniqueArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectsFindUniqueArgs>(args: SelectSubset<T, ProjectsFindUniqueArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Projects that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectsFindUniqueOrThrowArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectsFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsFindFirstArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectsFindFirstArgs>(args?: SelectSubset<T, ProjectsFindFirstArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Projects that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsFindFirstOrThrowArgs} args - Arguments to find a Projects
     * @example
     * // Get one Projects
     * const projects = await prisma.projects.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectsFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.projects.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.projects.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectsWithIdOnly = await prisma.projects.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectsFindManyArgs>(args?: SelectSubset<T, ProjectsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Projects.
     * @param {ProjectsCreateArgs} args - Arguments to create a Projects.
     * @example
     * // Create one Projects
     * const Projects = await prisma.projects.create({
     *   data: {
     *     // ... data to create a Projects
     *   }
     * })
     * 
     */
    create<T extends ProjectsCreateArgs>(args: SelectSubset<T, ProjectsCreateArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectsCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const projects = await prisma.projects.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectsCreateManyArgs>(args?: SelectSubset<T, ProjectsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectsCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const projects = await prisma.projects.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectsWithIdOnly = await prisma.projects.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectsCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Projects.
     * @param {ProjectsDeleteArgs} args - Arguments to delete one Projects.
     * @example
     * // Delete one Projects
     * const Projects = await prisma.projects.delete({
     *   where: {
     *     // ... filter to delete one Projects
     *   }
     * })
     * 
     */
    delete<T extends ProjectsDeleteArgs>(args: SelectSubset<T, ProjectsDeleteArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Projects.
     * @param {ProjectsUpdateArgs} args - Arguments to update one Projects.
     * @example
     * // Update one Projects
     * const projects = await prisma.projects.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectsUpdateArgs>(args: SelectSubset<T, ProjectsUpdateArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectsDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.projects.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectsDeleteManyArgs>(args?: SelectSubset<T, ProjectsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const projects = await prisma.projects.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectsUpdateManyArgs>(args: SelectSubset<T, ProjectsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectsUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const projects = await prisma.projects.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectsWithIdOnly = await prisma.projects.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectsUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Projects.
     * @param {ProjectsUpsertArgs} args - Arguments to update or create a Projects.
     * @example
     * // Update or create a Projects
     * const projects = await prisma.projects.upsert({
     *   create: {
     *     // ... data to create a Projects
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Projects we want to update
     *   }
     * })
     */
    upsert<T extends ProjectsUpsertArgs>(args: SelectSubset<T, ProjectsUpsertArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.projects.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectsCountArgs>(
      args?: Subset<T, ProjectsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectsAggregateArgs>(args: Subset<T, ProjectsAggregateArgs>): Prisma.PrismaPromise<GetProjectsAggregateType<T>>

    /**
     * Group by Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectsGroupByArgs['orderBy'] }
        : { orderBy?: ProjectsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Projects model
   */
  readonly fields: ProjectsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Projects.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    learningPhases<T extends Projects$learningPhasesArgs<ExtArgs> = {}>(args?: Subset<T, Projects$learningPhasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userProjects<T extends Projects$userProjectsArgs<ExtArgs> = {}>(args?: Subset<T, Projects$userProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deliverables<T extends Projects$deliverablesArgs<ExtArgs> = {}>(args?: Subset<T, Projects$deliverablesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Projects model
   */
  interface ProjectsFieldRefs {
    readonly id: FieldRef<"Projects", 'String'>
    readonly name: FieldRef<"Projects", 'String'>
    readonly tech_stack: FieldRef<"Projects", 'String[]'>
    readonly skill_level: FieldRef<"Projects", 'Skill_Level'>
    readonly goal: FieldRef<"Projects", 'String'>
    readonly demo_url: FieldRef<"Projects", 'String'>
    readonly estimated_minutes: FieldRef<"Projects", 'Int'>
    readonly initial_files: FieldRef<"Projects", 'Json'>
    readonly createdAt: FieldRef<"Projects", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Projects findUnique
   */
  export type ProjectsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where: ProjectsWhereUniqueInput
  }

  /**
   * Projects findUniqueOrThrow
   */
  export type ProjectsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where: ProjectsWhereUniqueInput
  }

  /**
   * Projects findFirst
   */
  export type ProjectsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectsOrderByWithRelationInput | ProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * Projects findFirstOrThrow
   */
  export type ProjectsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectsOrderByWithRelationInput | ProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * Projects findMany
   */
  export type ProjectsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectsOrderByWithRelationInput | ProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectsScalarFieldEnum | ProjectsScalarFieldEnum[]
  }

  /**
   * Projects create
   */
  export type ProjectsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * The data needed to create a Projects.
     */
    data: XOR<ProjectsCreateInput, ProjectsUncheckedCreateInput>
  }

  /**
   * Projects createMany
   */
  export type ProjectsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectsCreateManyInput | ProjectsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Projects createManyAndReturn
   */
  export type ProjectsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectsCreateManyInput | ProjectsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Projects update
   */
  export type ProjectsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * The data needed to update a Projects.
     */
    data: XOR<ProjectsUpdateInput, ProjectsUncheckedUpdateInput>
    /**
     * Choose, which Projects to update.
     */
    where: ProjectsWhereUniqueInput
  }

  /**
   * Projects updateMany
   */
  export type ProjectsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectsUpdateManyMutationInput, ProjectsUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectsWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Projects updateManyAndReturn
   */
  export type ProjectsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectsUpdateManyMutationInput, ProjectsUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectsWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Projects upsert
   */
  export type ProjectsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * The filter to search for the Projects to update in case it exists.
     */
    where: ProjectsWhereUniqueInput
    /**
     * In case the Projects found by the `where` argument doesn't exist, create a new Projects with this data.
     */
    create: XOR<ProjectsCreateInput, ProjectsUncheckedCreateInput>
    /**
     * In case the Projects was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectsUpdateInput, ProjectsUncheckedUpdateInput>
  }

  /**
   * Projects delete
   */
  export type ProjectsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
    /**
     * Filter which Projects to delete.
     */
    where: ProjectsWhereUniqueInput
  }

  /**
   * Projects deleteMany
   */
  export type ProjectsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectsWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Projects.learningPhases
   */
  export type Projects$learningPhasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    where?: LearningPhaseWhereInput
    orderBy?: LearningPhaseOrderByWithRelationInput | LearningPhaseOrderByWithRelationInput[]
    cursor?: LearningPhaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LearningPhaseScalarFieldEnum | LearningPhaseScalarFieldEnum[]
  }

  /**
   * Projects.userProjects
   */
  export type Projects$userProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    where?: UserProjectsWhereInput
    orderBy?: UserProjectsOrderByWithRelationInput | UserProjectsOrderByWithRelationInput[]
    cursor?: UserProjectsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProjectsScalarFieldEnum | UserProjectsScalarFieldEnum[]
  }

  /**
   * Projects.deliverables
   */
  export type Projects$deliverablesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    where?: DeliverableWhereInput
    orderBy?: DeliverableOrderByWithRelationInput | DeliverableOrderByWithRelationInput[]
    cursor?: DeliverableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeliverableScalarFieldEnum | DeliverableScalarFieldEnum[]
  }

  /**
   * Projects without action
   */
  export type ProjectsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Projects
     */
    select?: ProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Projects
     */
    omit?: ProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectsInclude<ExtArgs> | null
  }


  /**
   * Model Deliverable
   */

  export type AggregateDeliverable = {
    _count: DeliverableCountAggregateOutputType | null
    _avg: DeliverableAvgAggregateOutputType | null
    _sum: DeliverableSumAggregateOutputType | null
    _min: DeliverableMinAggregateOutputType | null
    _max: DeliverableMaxAggregateOutputType | null
  }

  export type DeliverableAvgAggregateOutputType = {
    order: number | null
  }

  export type DeliverableSumAggregateOutputType = {
    order: number | null
  }

  export type DeliverableMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    text: string | null
    order: number | null
  }

  export type DeliverableMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    text: string | null
    order: number | null
  }

  export type DeliverableCountAggregateOutputType = {
    id: number
    project_id: number
    text: number
    order: number
    _all: number
  }


  export type DeliverableAvgAggregateInputType = {
    order?: true
  }

  export type DeliverableSumAggregateInputType = {
    order?: true
  }

  export type DeliverableMinAggregateInputType = {
    id?: true
    project_id?: true
    text?: true
    order?: true
  }

  export type DeliverableMaxAggregateInputType = {
    id?: true
    project_id?: true
    text?: true
    order?: true
  }

  export type DeliverableCountAggregateInputType = {
    id?: true
    project_id?: true
    text?: true
    order?: true
    _all?: true
  }

  export type DeliverableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deliverable to aggregate.
     */
    where?: DeliverableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliverables to fetch.
     */
    orderBy?: DeliverableOrderByWithRelationInput | DeliverableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeliverableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliverables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliverables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Deliverables
    **/
    _count?: true | DeliverableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeliverableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeliverableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeliverableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeliverableMaxAggregateInputType
  }

  export type GetDeliverableAggregateType<T extends DeliverableAggregateArgs> = {
        [P in keyof T & keyof AggregateDeliverable]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeliverable[P]>
      : GetScalarType<T[P], AggregateDeliverable[P]>
  }




  export type DeliverableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliverableWhereInput
    orderBy?: DeliverableOrderByWithAggregationInput | DeliverableOrderByWithAggregationInput[]
    by: DeliverableScalarFieldEnum[] | DeliverableScalarFieldEnum
    having?: DeliverableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeliverableCountAggregateInputType | true
    _avg?: DeliverableAvgAggregateInputType
    _sum?: DeliverableSumAggregateInputType
    _min?: DeliverableMinAggregateInputType
    _max?: DeliverableMaxAggregateInputType
  }

  export type DeliverableGroupByOutputType = {
    id: string
    project_id: string
    text: string
    order: number
    _count: DeliverableCountAggregateOutputType | null
    _avg: DeliverableAvgAggregateOutputType | null
    _sum: DeliverableSumAggregateOutputType | null
    _min: DeliverableMinAggregateOutputType | null
    _max: DeliverableMaxAggregateOutputType | null
  }

  type GetDeliverableGroupByPayload<T extends DeliverableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeliverableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeliverableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeliverableGroupByOutputType[P]>
            : GetScalarType<T[P], DeliverableGroupByOutputType[P]>
        }
      >
    >


  export type DeliverableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    text?: boolean
    order?: boolean
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deliverable"]>

  export type DeliverableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    text?: boolean
    order?: boolean
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deliverable"]>

  export type DeliverableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    text?: boolean
    order?: boolean
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deliverable"]>

  export type DeliverableSelectScalar = {
    id?: boolean
    project_id?: boolean
    text?: boolean
    order?: boolean
  }

  export type DeliverableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "project_id" | "text" | "order", ExtArgs["result"]["deliverable"]>
  export type DeliverableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }
  export type DeliverableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }
  export type DeliverableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }

  export type $DeliverablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Deliverable"
    objects: {
      project: Prisma.$ProjectsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      text: string
      order: number
    }, ExtArgs["result"]["deliverable"]>
    composites: {}
  }

  type DeliverableGetPayload<S extends boolean | null | undefined | DeliverableDefaultArgs> = $Result.GetResult<Prisma.$DeliverablePayload, S>

  type DeliverableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeliverableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeliverableCountAggregateInputType | true
    }

  export interface DeliverableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Deliverable'], meta: { name: 'Deliverable' } }
    /**
     * Find zero or one Deliverable that matches the filter.
     * @param {DeliverableFindUniqueArgs} args - Arguments to find a Deliverable
     * @example
     * // Get one Deliverable
     * const deliverable = await prisma.deliverable.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeliverableFindUniqueArgs>(args: SelectSubset<T, DeliverableFindUniqueArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Deliverable that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeliverableFindUniqueOrThrowArgs} args - Arguments to find a Deliverable
     * @example
     * // Get one Deliverable
     * const deliverable = await prisma.deliverable.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeliverableFindUniqueOrThrowArgs>(args: SelectSubset<T, DeliverableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deliverable that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableFindFirstArgs} args - Arguments to find a Deliverable
     * @example
     * // Get one Deliverable
     * const deliverable = await prisma.deliverable.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeliverableFindFirstArgs>(args?: SelectSubset<T, DeliverableFindFirstArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deliverable that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableFindFirstOrThrowArgs} args - Arguments to find a Deliverable
     * @example
     * // Get one Deliverable
     * const deliverable = await prisma.deliverable.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeliverableFindFirstOrThrowArgs>(args?: SelectSubset<T, DeliverableFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Deliverables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deliverables
     * const deliverables = await prisma.deliverable.findMany()
     * 
     * // Get first 10 Deliverables
     * const deliverables = await prisma.deliverable.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deliverableWithIdOnly = await prisma.deliverable.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeliverableFindManyArgs>(args?: SelectSubset<T, DeliverableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Deliverable.
     * @param {DeliverableCreateArgs} args - Arguments to create a Deliverable.
     * @example
     * // Create one Deliverable
     * const Deliverable = await prisma.deliverable.create({
     *   data: {
     *     // ... data to create a Deliverable
     *   }
     * })
     * 
     */
    create<T extends DeliverableCreateArgs>(args: SelectSubset<T, DeliverableCreateArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Deliverables.
     * @param {DeliverableCreateManyArgs} args - Arguments to create many Deliverables.
     * @example
     * // Create many Deliverables
     * const deliverable = await prisma.deliverable.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeliverableCreateManyArgs>(args?: SelectSubset<T, DeliverableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Deliverables and returns the data saved in the database.
     * @param {DeliverableCreateManyAndReturnArgs} args - Arguments to create many Deliverables.
     * @example
     * // Create many Deliverables
     * const deliverable = await prisma.deliverable.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Deliverables and only return the `id`
     * const deliverableWithIdOnly = await prisma.deliverable.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeliverableCreateManyAndReturnArgs>(args?: SelectSubset<T, DeliverableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Deliverable.
     * @param {DeliverableDeleteArgs} args - Arguments to delete one Deliverable.
     * @example
     * // Delete one Deliverable
     * const Deliverable = await prisma.deliverable.delete({
     *   where: {
     *     // ... filter to delete one Deliverable
     *   }
     * })
     * 
     */
    delete<T extends DeliverableDeleteArgs>(args: SelectSubset<T, DeliverableDeleteArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Deliverable.
     * @param {DeliverableUpdateArgs} args - Arguments to update one Deliverable.
     * @example
     * // Update one Deliverable
     * const deliverable = await prisma.deliverable.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeliverableUpdateArgs>(args: SelectSubset<T, DeliverableUpdateArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Deliverables.
     * @param {DeliverableDeleteManyArgs} args - Arguments to filter Deliverables to delete.
     * @example
     * // Delete a few Deliverables
     * const { count } = await prisma.deliverable.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeliverableDeleteManyArgs>(args?: SelectSubset<T, DeliverableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deliverables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deliverables
     * const deliverable = await prisma.deliverable.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeliverableUpdateManyArgs>(args: SelectSubset<T, DeliverableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deliverables and returns the data updated in the database.
     * @param {DeliverableUpdateManyAndReturnArgs} args - Arguments to update many Deliverables.
     * @example
     * // Update many Deliverables
     * const deliverable = await prisma.deliverable.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Deliverables and only return the `id`
     * const deliverableWithIdOnly = await prisma.deliverable.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeliverableUpdateManyAndReturnArgs>(args: SelectSubset<T, DeliverableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Deliverable.
     * @param {DeliverableUpsertArgs} args - Arguments to update or create a Deliverable.
     * @example
     * // Update or create a Deliverable
     * const deliverable = await prisma.deliverable.upsert({
     *   create: {
     *     // ... data to create a Deliverable
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deliverable we want to update
     *   }
     * })
     */
    upsert<T extends DeliverableUpsertArgs>(args: SelectSubset<T, DeliverableUpsertArgs<ExtArgs>>): Prisma__DeliverableClient<$Result.GetResult<Prisma.$DeliverablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Deliverables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableCountArgs} args - Arguments to filter Deliverables to count.
     * @example
     * // Count the number of Deliverables
     * const count = await prisma.deliverable.count({
     *   where: {
     *     // ... the filter for the Deliverables we want to count
     *   }
     * })
    **/
    count<T extends DeliverableCountArgs>(
      args?: Subset<T, DeliverableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeliverableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deliverable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeliverableAggregateArgs>(args: Subset<T, DeliverableAggregateArgs>): Prisma.PrismaPromise<GetDeliverableAggregateType<T>>

    /**
     * Group by Deliverable.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliverableGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeliverableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeliverableGroupByArgs['orderBy'] }
        : { orderBy?: DeliverableGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeliverableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeliverableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Deliverable model
   */
  readonly fields: DeliverableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Deliverable.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeliverableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectsDefaultArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Deliverable model
   */
  interface DeliverableFieldRefs {
    readonly id: FieldRef<"Deliverable", 'String'>
    readonly project_id: FieldRef<"Deliverable", 'String'>
    readonly text: FieldRef<"Deliverable", 'String'>
    readonly order: FieldRef<"Deliverable", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Deliverable findUnique
   */
  export type DeliverableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * Filter, which Deliverable to fetch.
     */
    where: DeliverableWhereUniqueInput
  }

  /**
   * Deliverable findUniqueOrThrow
   */
  export type DeliverableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * Filter, which Deliverable to fetch.
     */
    where: DeliverableWhereUniqueInput
  }

  /**
   * Deliverable findFirst
   */
  export type DeliverableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * Filter, which Deliverable to fetch.
     */
    where?: DeliverableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliverables to fetch.
     */
    orderBy?: DeliverableOrderByWithRelationInput | DeliverableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deliverables.
     */
    cursor?: DeliverableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliverables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliverables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deliverables.
     */
    distinct?: DeliverableScalarFieldEnum | DeliverableScalarFieldEnum[]
  }

  /**
   * Deliverable findFirstOrThrow
   */
  export type DeliverableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * Filter, which Deliverable to fetch.
     */
    where?: DeliverableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliverables to fetch.
     */
    orderBy?: DeliverableOrderByWithRelationInput | DeliverableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deliverables.
     */
    cursor?: DeliverableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliverables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliverables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deliverables.
     */
    distinct?: DeliverableScalarFieldEnum | DeliverableScalarFieldEnum[]
  }

  /**
   * Deliverable findMany
   */
  export type DeliverableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * Filter, which Deliverables to fetch.
     */
    where?: DeliverableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliverables to fetch.
     */
    orderBy?: DeliverableOrderByWithRelationInput | DeliverableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Deliverables.
     */
    cursor?: DeliverableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliverables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliverables.
     */
    skip?: number
    distinct?: DeliverableScalarFieldEnum | DeliverableScalarFieldEnum[]
  }

  /**
   * Deliverable create
   */
  export type DeliverableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * The data needed to create a Deliverable.
     */
    data: XOR<DeliverableCreateInput, DeliverableUncheckedCreateInput>
  }

  /**
   * Deliverable createMany
   */
  export type DeliverableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Deliverables.
     */
    data: DeliverableCreateManyInput | DeliverableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deliverable createManyAndReturn
   */
  export type DeliverableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * The data used to create many Deliverables.
     */
    data: DeliverableCreateManyInput | DeliverableCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deliverable update
   */
  export type DeliverableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * The data needed to update a Deliverable.
     */
    data: XOR<DeliverableUpdateInput, DeliverableUncheckedUpdateInput>
    /**
     * Choose, which Deliverable to update.
     */
    where: DeliverableWhereUniqueInput
  }

  /**
   * Deliverable updateMany
   */
  export type DeliverableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Deliverables.
     */
    data: XOR<DeliverableUpdateManyMutationInput, DeliverableUncheckedUpdateManyInput>
    /**
     * Filter which Deliverables to update
     */
    where?: DeliverableWhereInput
    /**
     * Limit how many Deliverables to update.
     */
    limit?: number
  }

  /**
   * Deliverable updateManyAndReturn
   */
  export type DeliverableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * The data used to update Deliverables.
     */
    data: XOR<DeliverableUpdateManyMutationInput, DeliverableUncheckedUpdateManyInput>
    /**
     * Filter which Deliverables to update
     */
    where?: DeliverableWhereInput
    /**
     * Limit how many Deliverables to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deliverable upsert
   */
  export type DeliverableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * The filter to search for the Deliverable to update in case it exists.
     */
    where: DeliverableWhereUniqueInput
    /**
     * In case the Deliverable found by the `where` argument doesn't exist, create a new Deliverable with this data.
     */
    create: XOR<DeliverableCreateInput, DeliverableUncheckedCreateInput>
    /**
     * In case the Deliverable was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeliverableUpdateInput, DeliverableUncheckedUpdateInput>
  }

  /**
   * Deliverable delete
   */
  export type DeliverableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
    /**
     * Filter which Deliverable to delete.
     */
    where: DeliverableWhereUniqueInput
  }

  /**
   * Deliverable deleteMany
   */
  export type DeliverableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deliverables to delete
     */
    where?: DeliverableWhereInput
    /**
     * Limit how many Deliverables to delete.
     */
    limit?: number
  }

  /**
   * Deliverable without action
   */
  export type DeliverableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deliverable
     */
    select?: DeliverableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deliverable
     */
    omit?: DeliverableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliverableInclude<ExtArgs> | null
  }


  /**
   * Model EntranceQuestion
   */

  export type AggregateEntranceQuestion = {
    _count: EntranceQuestionCountAggregateOutputType | null
    _avg: EntranceQuestionAvgAggregateOutputType | null
    _sum: EntranceQuestionSumAggregateOutputType | null
    _min: EntranceQuestionMinAggregateOutputType | null
    _max: EntranceQuestionMaxAggregateOutputType | null
  }

  export type EntranceQuestionAvgAggregateOutputType = {
    correct_option: number | null
  }

  export type EntranceQuestionSumAggregateOutputType = {
    correct_option: number | null
  }

  export type EntranceQuestionMinAggregateOutputType = {
    id: string | null
    question: string | null
    correct_option: number | null
    description: string | null
    explanation: string | null
    difficulty: $Enums.Difficulty | null
    topic: string | null
    createdAt: Date | null
  }

  export type EntranceQuestionMaxAggregateOutputType = {
    id: string | null
    question: string | null
    correct_option: number | null
    description: string | null
    explanation: string | null
    difficulty: $Enums.Difficulty | null
    topic: string | null
    createdAt: Date | null
  }

  export type EntranceQuestionCountAggregateOutputType = {
    id: number
    question: number
    options: number
    correct_option: number
    description: number
    explanation: number
    difficulty: number
    topic: number
    createdAt: number
    _all: number
  }


  export type EntranceQuestionAvgAggregateInputType = {
    correct_option?: true
  }

  export type EntranceQuestionSumAggregateInputType = {
    correct_option?: true
  }

  export type EntranceQuestionMinAggregateInputType = {
    id?: true
    question?: true
    correct_option?: true
    description?: true
    explanation?: true
    difficulty?: true
    topic?: true
    createdAt?: true
  }

  export type EntranceQuestionMaxAggregateInputType = {
    id?: true
    question?: true
    correct_option?: true
    description?: true
    explanation?: true
    difficulty?: true
    topic?: true
    createdAt?: true
  }

  export type EntranceQuestionCountAggregateInputType = {
    id?: true
    question?: true
    options?: true
    correct_option?: true
    description?: true
    explanation?: true
    difficulty?: true
    topic?: true
    createdAt?: true
    _all?: true
  }

  export type EntranceQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntranceQuestion to aggregate.
     */
    where?: EntranceQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceQuestions to fetch.
     */
    orderBy?: EntranceQuestionOrderByWithRelationInput | EntranceQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EntranceQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EntranceQuestions
    **/
    _count?: true | EntranceQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EntranceQuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EntranceQuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EntranceQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EntranceQuestionMaxAggregateInputType
  }

  export type GetEntranceQuestionAggregateType<T extends EntranceQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateEntranceQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEntranceQuestion[P]>
      : GetScalarType<T[P], AggregateEntranceQuestion[P]>
  }




  export type EntranceQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntranceQuestionWhereInput
    orderBy?: EntranceQuestionOrderByWithAggregationInput | EntranceQuestionOrderByWithAggregationInput[]
    by: EntranceQuestionScalarFieldEnum[] | EntranceQuestionScalarFieldEnum
    having?: EntranceQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EntranceQuestionCountAggregateInputType | true
    _avg?: EntranceQuestionAvgAggregateInputType
    _sum?: EntranceQuestionSumAggregateInputType
    _min?: EntranceQuestionMinAggregateInputType
    _max?: EntranceQuestionMaxAggregateInputType
  }

  export type EntranceQuestionGroupByOutputType = {
    id: string
    question: string
    options: string[]
    correct_option: number
    description: string
    explanation: string
    difficulty: $Enums.Difficulty
    topic: string
    createdAt: Date
    _count: EntranceQuestionCountAggregateOutputType | null
    _avg: EntranceQuestionAvgAggregateOutputType | null
    _sum: EntranceQuestionSumAggregateOutputType | null
    _min: EntranceQuestionMinAggregateOutputType | null
    _max: EntranceQuestionMaxAggregateOutputType | null
  }

  type GetEntranceQuestionGroupByPayload<T extends EntranceQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EntranceQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EntranceQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EntranceQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], EntranceQuestionGroupByOutputType[P]>
        }
      >
    >


  export type EntranceQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    options?: boolean
    correct_option?: boolean
    description?: boolean
    explanation?: boolean
    difficulty?: boolean
    topic?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["entranceQuestion"]>

  export type EntranceQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    options?: boolean
    correct_option?: boolean
    description?: boolean
    explanation?: boolean
    difficulty?: boolean
    topic?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["entranceQuestion"]>

  export type EntranceQuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    options?: boolean
    correct_option?: boolean
    description?: boolean
    explanation?: boolean
    difficulty?: boolean
    topic?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["entranceQuestion"]>

  export type EntranceQuestionSelectScalar = {
    id?: boolean
    question?: boolean
    options?: boolean
    correct_option?: boolean
    description?: boolean
    explanation?: boolean
    difficulty?: boolean
    topic?: boolean
    createdAt?: boolean
  }

  export type EntranceQuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "options" | "correct_option" | "description" | "explanation" | "difficulty" | "topic" | "createdAt", ExtArgs["result"]["entranceQuestion"]>

  export type $EntranceQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EntranceQuestion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question: string
      options: string[]
      correct_option: number
      description: string
      explanation: string
      difficulty: $Enums.Difficulty
      topic: string
      createdAt: Date
    }, ExtArgs["result"]["entranceQuestion"]>
    composites: {}
  }

  type EntranceQuestionGetPayload<S extends boolean | null | undefined | EntranceQuestionDefaultArgs> = $Result.GetResult<Prisma.$EntranceQuestionPayload, S>

  type EntranceQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EntranceQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EntranceQuestionCountAggregateInputType | true
    }

  export interface EntranceQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EntranceQuestion'], meta: { name: 'EntranceQuestion' } }
    /**
     * Find zero or one EntranceQuestion that matches the filter.
     * @param {EntranceQuestionFindUniqueArgs} args - Arguments to find a EntranceQuestion
     * @example
     * // Get one EntranceQuestion
     * const entranceQuestion = await prisma.entranceQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EntranceQuestionFindUniqueArgs>(args: SelectSubset<T, EntranceQuestionFindUniqueArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EntranceQuestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EntranceQuestionFindUniqueOrThrowArgs} args - Arguments to find a EntranceQuestion
     * @example
     * // Get one EntranceQuestion
     * const entranceQuestion = await prisma.entranceQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EntranceQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, EntranceQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EntranceQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionFindFirstArgs} args - Arguments to find a EntranceQuestion
     * @example
     * // Get one EntranceQuestion
     * const entranceQuestion = await prisma.entranceQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EntranceQuestionFindFirstArgs>(args?: SelectSubset<T, EntranceQuestionFindFirstArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EntranceQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionFindFirstOrThrowArgs} args - Arguments to find a EntranceQuestion
     * @example
     * // Get one EntranceQuestion
     * const entranceQuestion = await prisma.entranceQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EntranceQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, EntranceQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EntranceQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EntranceQuestions
     * const entranceQuestions = await prisma.entranceQuestion.findMany()
     * 
     * // Get first 10 EntranceQuestions
     * const entranceQuestions = await prisma.entranceQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const entranceQuestionWithIdOnly = await prisma.entranceQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EntranceQuestionFindManyArgs>(args?: SelectSubset<T, EntranceQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EntranceQuestion.
     * @param {EntranceQuestionCreateArgs} args - Arguments to create a EntranceQuestion.
     * @example
     * // Create one EntranceQuestion
     * const EntranceQuestion = await prisma.entranceQuestion.create({
     *   data: {
     *     // ... data to create a EntranceQuestion
     *   }
     * })
     * 
     */
    create<T extends EntranceQuestionCreateArgs>(args: SelectSubset<T, EntranceQuestionCreateArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EntranceQuestions.
     * @param {EntranceQuestionCreateManyArgs} args - Arguments to create many EntranceQuestions.
     * @example
     * // Create many EntranceQuestions
     * const entranceQuestion = await prisma.entranceQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EntranceQuestionCreateManyArgs>(args?: SelectSubset<T, EntranceQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EntranceQuestions and returns the data saved in the database.
     * @param {EntranceQuestionCreateManyAndReturnArgs} args - Arguments to create many EntranceQuestions.
     * @example
     * // Create many EntranceQuestions
     * const entranceQuestion = await prisma.entranceQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EntranceQuestions and only return the `id`
     * const entranceQuestionWithIdOnly = await prisma.entranceQuestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EntranceQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, EntranceQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EntranceQuestion.
     * @param {EntranceQuestionDeleteArgs} args - Arguments to delete one EntranceQuestion.
     * @example
     * // Delete one EntranceQuestion
     * const EntranceQuestion = await prisma.entranceQuestion.delete({
     *   where: {
     *     // ... filter to delete one EntranceQuestion
     *   }
     * })
     * 
     */
    delete<T extends EntranceQuestionDeleteArgs>(args: SelectSubset<T, EntranceQuestionDeleteArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EntranceQuestion.
     * @param {EntranceQuestionUpdateArgs} args - Arguments to update one EntranceQuestion.
     * @example
     * // Update one EntranceQuestion
     * const entranceQuestion = await prisma.entranceQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EntranceQuestionUpdateArgs>(args: SelectSubset<T, EntranceQuestionUpdateArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EntranceQuestions.
     * @param {EntranceQuestionDeleteManyArgs} args - Arguments to filter EntranceQuestions to delete.
     * @example
     * // Delete a few EntranceQuestions
     * const { count } = await prisma.entranceQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EntranceQuestionDeleteManyArgs>(args?: SelectSubset<T, EntranceQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EntranceQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EntranceQuestions
     * const entranceQuestion = await prisma.entranceQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EntranceQuestionUpdateManyArgs>(args: SelectSubset<T, EntranceQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EntranceQuestions and returns the data updated in the database.
     * @param {EntranceQuestionUpdateManyAndReturnArgs} args - Arguments to update many EntranceQuestions.
     * @example
     * // Update many EntranceQuestions
     * const entranceQuestion = await prisma.entranceQuestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EntranceQuestions and only return the `id`
     * const entranceQuestionWithIdOnly = await prisma.entranceQuestion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EntranceQuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, EntranceQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EntranceQuestion.
     * @param {EntranceQuestionUpsertArgs} args - Arguments to update or create a EntranceQuestion.
     * @example
     * // Update or create a EntranceQuestion
     * const entranceQuestion = await prisma.entranceQuestion.upsert({
     *   create: {
     *     // ... data to create a EntranceQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EntranceQuestion we want to update
     *   }
     * })
     */
    upsert<T extends EntranceQuestionUpsertArgs>(args: SelectSubset<T, EntranceQuestionUpsertArgs<ExtArgs>>): Prisma__EntranceQuestionClient<$Result.GetResult<Prisma.$EntranceQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EntranceQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionCountArgs} args - Arguments to filter EntranceQuestions to count.
     * @example
     * // Count the number of EntranceQuestions
     * const count = await prisma.entranceQuestion.count({
     *   where: {
     *     // ... the filter for the EntranceQuestions we want to count
     *   }
     * })
    **/
    count<T extends EntranceQuestionCountArgs>(
      args?: Subset<T, EntranceQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EntranceQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EntranceQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EntranceQuestionAggregateArgs>(args: Subset<T, EntranceQuestionAggregateArgs>): Prisma.PrismaPromise<GetEntranceQuestionAggregateType<T>>

    /**
     * Group by EntranceQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceQuestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EntranceQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EntranceQuestionGroupByArgs['orderBy'] }
        : { orderBy?: EntranceQuestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EntranceQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntranceQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EntranceQuestion model
   */
  readonly fields: EntranceQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EntranceQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EntranceQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EntranceQuestion model
   */
  interface EntranceQuestionFieldRefs {
    readonly id: FieldRef<"EntranceQuestion", 'String'>
    readonly question: FieldRef<"EntranceQuestion", 'String'>
    readonly options: FieldRef<"EntranceQuestion", 'String[]'>
    readonly correct_option: FieldRef<"EntranceQuestion", 'Int'>
    readonly description: FieldRef<"EntranceQuestion", 'String'>
    readonly explanation: FieldRef<"EntranceQuestion", 'String'>
    readonly difficulty: FieldRef<"EntranceQuestion", 'Difficulty'>
    readonly topic: FieldRef<"EntranceQuestion", 'String'>
    readonly createdAt: FieldRef<"EntranceQuestion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EntranceQuestion findUnique
   */
  export type EntranceQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * Filter, which EntranceQuestion to fetch.
     */
    where: EntranceQuestionWhereUniqueInput
  }

  /**
   * EntranceQuestion findUniqueOrThrow
   */
  export type EntranceQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * Filter, which EntranceQuestion to fetch.
     */
    where: EntranceQuestionWhereUniqueInput
  }

  /**
   * EntranceQuestion findFirst
   */
  export type EntranceQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * Filter, which EntranceQuestion to fetch.
     */
    where?: EntranceQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceQuestions to fetch.
     */
    orderBy?: EntranceQuestionOrderByWithRelationInput | EntranceQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntranceQuestions.
     */
    cursor?: EntranceQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntranceQuestions.
     */
    distinct?: EntranceQuestionScalarFieldEnum | EntranceQuestionScalarFieldEnum[]
  }

  /**
   * EntranceQuestion findFirstOrThrow
   */
  export type EntranceQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * Filter, which EntranceQuestion to fetch.
     */
    where?: EntranceQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceQuestions to fetch.
     */
    orderBy?: EntranceQuestionOrderByWithRelationInput | EntranceQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntranceQuestions.
     */
    cursor?: EntranceQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntranceQuestions.
     */
    distinct?: EntranceQuestionScalarFieldEnum | EntranceQuestionScalarFieldEnum[]
  }

  /**
   * EntranceQuestion findMany
   */
  export type EntranceQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * Filter, which EntranceQuestions to fetch.
     */
    where?: EntranceQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceQuestions to fetch.
     */
    orderBy?: EntranceQuestionOrderByWithRelationInput | EntranceQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EntranceQuestions.
     */
    cursor?: EntranceQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceQuestions.
     */
    skip?: number
    distinct?: EntranceQuestionScalarFieldEnum | EntranceQuestionScalarFieldEnum[]
  }

  /**
   * EntranceQuestion create
   */
  export type EntranceQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * The data needed to create a EntranceQuestion.
     */
    data: XOR<EntranceQuestionCreateInput, EntranceQuestionUncheckedCreateInput>
  }

  /**
   * EntranceQuestion createMany
   */
  export type EntranceQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EntranceQuestions.
     */
    data: EntranceQuestionCreateManyInput | EntranceQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EntranceQuestion createManyAndReturn
   */
  export type EntranceQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * The data used to create many EntranceQuestions.
     */
    data: EntranceQuestionCreateManyInput | EntranceQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EntranceQuestion update
   */
  export type EntranceQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * The data needed to update a EntranceQuestion.
     */
    data: XOR<EntranceQuestionUpdateInput, EntranceQuestionUncheckedUpdateInput>
    /**
     * Choose, which EntranceQuestion to update.
     */
    where: EntranceQuestionWhereUniqueInput
  }

  /**
   * EntranceQuestion updateMany
   */
  export type EntranceQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EntranceQuestions.
     */
    data: XOR<EntranceQuestionUpdateManyMutationInput, EntranceQuestionUncheckedUpdateManyInput>
    /**
     * Filter which EntranceQuestions to update
     */
    where?: EntranceQuestionWhereInput
    /**
     * Limit how many EntranceQuestions to update.
     */
    limit?: number
  }

  /**
   * EntranceQuestion updateManyAndReturn
   */
  export type EntranceQuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * The data used to update EntranceQuestions.
     */
    data: XOR<EntranceQuestionUpdateManyMutationInput, EntranceQuestionUncheckedUpdateManyInput>
    /**
     * Filter which EntranceQuestions to update
     */
    where?: EntranceQuestionWhereInput
    /**
     * Limit how many EntranceQuestions to update.
     */
    limit?: number
  }

  /**
   * EntranceQuestion upsert
   */
  export type EntranceQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * The filter to search for the EntranceQuestion to update in case it exists.
     */
    where: EntranceQuestionWhereUniqueInput
    /**
     * In case the EntranceQuestion found by the `where` argument doesn't exist, create a new EntranceQuestion with this data.
     */
    create: XOR<EntranceQuestionCreateInput, EntranceQuestionUncheckedCreateInput>
    /**
     * In case the EntranceQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EntranceQuestionUpdateInput, EntranceQuestionUncheckedUpdateInput>
  }

  /**
   * EntranceQuestion delete
   */
  export type EntranceQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
    /**
     * Filter which EntranceQuestion to delete.
     */
    where: EntranceQuestionWhereUniqueInput
  }

  /**
   * EntranceQuestion deleteMany
   */
  export type EntranceQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntranceQuestions to delete
     */
    where?: EntranceQuestionWhereInput
    /**
     * Limit how many EntranceQuestions to delete.
     */
    limit?: number
  }

  /**
   * EntranceQuestion without action
   */
  export type EntranceQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceQuestion
     */
    select?: EntranceQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceQuestion
     */
    omit?: EntranceQuestionOmit<ExtArgs> | null
  }


  /**
   * Model EntranceTestAttempt
   */

  export type AggregateEntranceTestAttempt = {
    _count: EntranceTestAttemptCountAggregateOutputType | null
    _avg: EntranceTestAttemptAvgAggregateOutputType | null
    _sum: EntranceTestAttemptSumAggregateOutputType | null
    _min: EntranceTestAttemptMinAggregateOutputType | null
    _max: EntranceTestAttemptMaxAggregateOutputType | null
  }

  export type EntranceTestAttemptAvgAggregateOutputType = {
    round: number | null
  }

  export type EntranceTestAttemptSumAggregateOutputType = {
    round: number | null
  }

  export type EntranceTestAttemptMinAggregateOutputType = {
    id: string | null
    user_email: string | null
    status: $Enums.TestStatus | null
    round: number | null
    result_level: $Enums.Skill_Level | null
    started_at: Date | null
    completed_at: Date | null
  }

  export type EntranceTestAttemptMaxAggregateOutputType = {
    id: string | null
    user_email: string | null
    status: $Enums.TestStatus | null
    round: number | null
    result_level: $Enums.Skill_Level | null
    started_at: Date | null
    completed_at: Date | null
  }

  export type EntranceTestAttemptCountAggregateOutputType = {
    id: number
    user_email: number
    status: number
    round: number
    answers: number
    result_level: number
    started_at: number
    completed_at: number
    _all: number
  }


  export type EntranceTestAttemptAvgAggregateInputType = {
    round?: true
  }

  export type EntranceTestAttemptSumAggregateInputType = {
    round?: true
  }

  export type EntranceTestAttemptMinAggregateInputType = {
    id?: true
    user_email?: true
    status?: true
    round?: true
    result_level?: true
    started_at?: true
    completed_at?: true
  }

  export type EntranceTestAttemptMaxAggregateInputType = {
    id?: true
    user_email?: true
    status?: true
    round?: true
    result_level?: true
    started_at?: true
    completed_at?: true
  }

  export type EntranceTestAttemptCountAggregateInputType = {
    id?: true
    user_email?: true
    status?: true
    round?: true
    answers?: true
    result_level?: true
    started_at?: true
    completed_at?: true
    _all?: true
  }

  export type EntranceTestAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntranceTestAttempt to aggregate.
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceTestAttempts to fetch.
     */
    orderBy?: EntranceTestAttemptOrderByWithRelationInput | EntranceTestAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EntranceTestAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceTestAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceTestAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EntranceTestAttempts
    **/
    _count?: true | EntranceTestAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EntranceTestAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EntranceTestAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EntranceTestAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EntranceTestAttemptMaxAggregateInputType
  }

  export type GetEntranceTestAttemptAggregateType<T extends EntranceTestAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateEntranceTestAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEntranceTestAttempt[P]>
      : GetScalarType<T[P], AggregateEntranceTestAttempt[P]>
  }




  export type EntranceTestAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntranceTestAttemptWhereInput
    orderBy?: EntranceTestAttemptOrderByWithAggregationInput | EntranceTestAttemptOrderByWithAggregationInput[]
    by: EntranceTestAttemptScalarFieldEnum[] | EntranceTestAttemptScalarFieldEnum
    having?: EntranceTestAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EntranceTestAttemptCountAggregateInputType | true
    _avg?: EntranceTestAttemptAvgAggregateInputType
    _sum?: EntranceTestAttemptSumAggregateInputType
    _min?: EntranceTestAttemptMinAggregateInputType
    _max?: EntranceTestAttemptMaxAggregateInputType
  }

  export type EntranceTestAttemptGroupByOutputType = {
    id: string
    user_email: string
    status: $Enums.TestStatus
    round: number
    answers: JsonValue
    result_level: $Enums.Skill_Level | null
    started_at: Date
    completed_at: Date | null
    _count: EntranceTestAttemptCountAggregateOutputType | null
    _avg: EntranceTestAttemptAvgAggregateOutputType | null
    _sum: EntranceTestAttemptSumAggregateOutputType | null
    _min: EntranceTestAttemptMinAggregateOutputType | null
    _max: EntranceTestAttemptMaxAggregateOutputType | null
  }

  type GetEntranceTestAttemptGroupByPayload<T extends EntranceTestAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EntranceTestAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EntranceTestAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EntranceTestAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], EntranceTestAttemptGroupByOutputType[P]>
        }
      >
    >


  export type EntranceTestAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_email?: boolean
    status?: boolean
    round?: boolean
    answers?: boolean
    result_level?: boolean
    started_at?: boolean
    completed_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entranceTestAttempt"]>

  export type EntranceTestAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_email?: boolean
    status?: boolean
    round?: boolean
    answers?: boolean
    result_level?: boolean
    started_at?: boolean
    completed_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entranceTestAttempt"]>

  export type EntranceTestAttemptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_email?: boolean
    status?: boolean
    round?: boolean
    answers?: boolean
    result_level?: boolean
    started_at?: boolean
    completed_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entranceTestAttempt"]>

  export type EntranceTestAttemptSelectScalar = {
    id?: boolean
    user_email?: boolean
    status?: boolean
    round?: boolean
    answers?: boolean
    result_level?: boolean
    started_at?: boolean
    completed_at?: boolean
  }

  export type EntranceTestAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_email" | "status" | "round" | "answers" | "result_level" | "started_at" | "completed_at", ExtArgs["result"]["entranceTestAttempt"]>
  export type EntranceTestAttemptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EntranceTestAttemptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EntranceTestAttemptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EntranceTestAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EntranceTestAttempt"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_email: string
      status: $Enums.TestStatus
      round: number
      answers: Prisma.JsonValue
      result_level: $Enums.Skill_Level | null
      started_at: Date
      completed_at: Date | null
    }, ExtArgs["result"]["entranceTestAttempt"]>
    composites: {}
  }

  type EntranceTestAttemptGetPayload<S extends boolean | null | undefined | EntranceTestAttemptDefaultArgs> = $Result.GetResult<Prisma.$EntranceTestAttemptPayload, S>

  type EntranceTestAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EntranceTestAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EntranceTestAttemptCountAggregateInputType | true
    }

  export interface EntranceTestAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EntranceTestAttempt'], meta: { name: 'EntranceTestAttempt' } }
    /**
     * Find zero or one EntranceTestAttempt that matches the filter.
     * @param {EntranceTestAttemptFindUniqueArgs} args - Arguments to find a EntranceTestAttempt
     * @example
     * // Get one EntranceTestAttempt
     * const entranceTestAttempt = await prisma.entranceTestAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EntranceTestAttemptFindUniqueArgs>(args: SelectSubset<T, EntranceTestAttemptFindUniqueArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EntranceTestAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EntranceTestAttemptFindUniqueOrThrowArgs} args - Arguments to find a EntranceTestAttempt
     * @example
     * // Get one EntranceTestAttempt
     * const entranceTestAttempt = await prisma.entranceTestAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EntranceTestAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, EntranceTestAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EntranceTestAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptFindFirstArgs} args - Arguments to find a EntranceTestAttempt
     * @example
     * // Get one EntranceTestAttempt
     * const entranceTestAttempt = await prisma.entranceTestAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EntranceTestAttemptFindFirstArgs>(args?: SelectSubset<T, EntranceTestAttemptFindFirstArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EntranceTestAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptFindFirstOrThrowArgs} args - Arguments to find a EntranceTestAttempt
     * @example
     * // Get one EntranceTestAttempt
     * const entranceTestAttempt = await prisma.entranceTestAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EntranceTestAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, EntranceTestAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EntranceTestAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EntranceTestAttempts
     * const entranceTestAttempts = await prisma.entranceTestAttempt.findMany()
     * 
     * // Get first 10 EntranceTestAttempts
     * const entranceTestAttempts = await prisma.entranceTestAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const entranceTestAttemptWithIdOnly = await prisma.entranceTestAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EntranceTestAttemptFindManyArgs>(args?: SelectSubset<T, EntranceTestAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EntranceTestAttempt.
     * @param {EntranceTestAttemptCreateArgs} args - Arguments to create a EntranceTestAttempt.
     * @example
     * // Create one EntranceTestAttempt
     * const EntranceTestAttempt = await prisma.entranceTestAttempt.create({
     *   data: {
     *     // ... data to create a EntranceTestAttempt
     *   }
     * })
     * 
     */
    create<T extends EntranceTestAttemptCreateArgs>(args: SelectSubset<T, EntranceTestAttemptCreateArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EntranceTestAttempts.
     * @param {EntranceTestAttemptCreateManyArgs} args - Arguments to create many EntranceTestAttempts.
     * @example
     * // Create many EntranceTestAttempts
     * const entranceTestAttempt = await prisma.entranceTestAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EntranceTestAttemptCreateManyArgs>(args?: SelectSubset<T, EntranceTestAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EntranceTestAttempts and returns the data saved in the database.
     * @param {EntranceTestAttemptCreateManyAndReturnArgs} args - Arguments to create many EntranceTestAttempts.
     * @example
     * // Create many EntranceTestAttempts
     * const entranceTestAttempt = await prisma.entranceTestAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EntranceTestAttempts and only return the `id`
     * const entranceTestAttemptWithIdOnly = await prisma.entranceTestAttempt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EntranceTestAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, EntranceTestAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EntranceTestAttempt.
     * @param {EntranceTestAttemptDeleteArgs} args - Arguments to delete one EntranceTestAttempt.
     * @example
     * // Delete one EntranceTestAttempt
     * const EntranceTestAttempt = await prisma.entranceTestAttempt.delete({
     *   where: {
     *     // ... filter to delete one EntranceTestAttempt
     *   }
     * })
     * 
     */
    delete<T extends EntranceTestAttemptDeleteArgs>(args: SelectSubset<T, EntranceTestAttemptDeleteArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EntranceTestAttempt.
     * @param {EntranceTestAttemptUpdateArgs} args - Arguments to update one EntranceTestAttempt.
     * @example
     * // Update one EntranceTestAttempt
     * const entranceTestAttempt = await prisma.entranceTestAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EntranceTestAttemptUpdateArgs>(args: SelectSubset<T, EntranceTestAttemptUpdateArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EntranceTestAttempts.
     * @param {EntranceTestAttemptDeleteManyArgs} args - Arguments to filter EntranceTestAttempts to delete.
     * @example
     * // Delete a few EntranceTestAttempts
     * const { count } = await prisma.entranceTestAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EntranceTestAttemptDeleteManyArgs>(args?: SelectSubset<T, EntranceTestAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EntranceTestAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EntranceTestAttempts
     * const entranceTestAttempt = await prisma.entranceTestAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EntranceTestAttemptUpdateManyArgs>(args: SelectSubset<T, EntranceTestAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EntranceTestAttempts and returns the data updated in the database.
     * @param {EntranceTestAttemptUpdateManyAndReturnArgs} args - Arguments to update many EntranceTestAttempts.
     * @example
     * // Update many EntranceTestAttempts
     * const entranceTestAttempt = await prisma.entranceTestAttempt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EntranceTestAttempts and only return the `id`
     * const entranceTestAttemptWithIdOnly = await prisma.entranceTestAttempt.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EntranceTestAttemptUpdateManyAndReturnArgs>(args: SelectSubset<T, EntranceTestAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EntranceTestAttempt.
     * @param {EntranceTestAttemptUpsertArgs} args - Arguments to update or create a EntranceTestAttempt.
     * @example
     * // Update or create a EntranceTestAttempt
     * const entranceTestAttempt = await prisma.entranceTestAttempt.upsert({
     *   create: {
     *     // ... data to create a EntranceTestAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EntranceTestAttempt we want to update
     *   }
     * })
     */
    upsert<T extends EntranceTestAttemptUpsertArgs>(args: SelectSubset<T, EntranceTestAttemptUpsertArgs<ExtArgs>>): Prisma__EntranceTestAttemptClient<$Result.GetResult<Prisma.$EntranceTestAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EntranceTestAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptCountArgs} args - Arguments to filter EntranceTestAttempts to count.
     * @example
     * // Count the number of EntranceTestAttempts
     * const count = await prisma.entranceTestAttempt.count({
     *   where: {
     *     // ... the filter for the EntranceTestAttempts we want to count
     *   }
     * })
    **/
    count<T extends EntranceTestAttemptCountArgs>(
      args?: Subset<T, EntranceTestAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EntranceTestAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EntranceTestAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EntranceTestAttemptAggregateArgs>(args: Subset<T, EntranceTestAttemptAggregateArgs>): Prisma.PrismaPromise<GetEntranceTestAttemptAggregateType<T>>

    /**
     * Group by EntranceTestAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntranceTestAttemptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EntranceTestAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EntranceTestAttemptGroupByArgs['orderBy'] }
        : { orderBy?: EntranceTestAttemptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EntranceTestAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntranceTestAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EntranceTestAttempt model
   */
  readonly fields: EntranceTestAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EntranceTestAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EntranceTestAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EntranceTestAttempt model
   */
  interface EntranceTestAttemptFieldRefs {
    readonly id: FieldRef<"EntranceTestAttempt", 'String'>
    readonly user_email: FieldRef<"EntranceTestAttempt", 'String'>
    readonly status: FieldRef<"EntranceTestAttempt", 'TestStatus'>
    readonly round: FieldRef<"EntranceTestAttempt", 'Int'>
    readonly answers: FieldRef<"EntranceTestAttempt", 'Json'>
    readonly result_level: FieldRef<"EntranceTestAttempt", 'Skill_Level'>
    readonly started_at: FieldRef<"EntranceTestAttempt", 'DateTime'>
    readonly completed_at: FieldRef<"EntranceTestAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EntranceTestAttempt findUnique
   */
  export type EntranceTestAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EntranceTestAttempt to fetch.
     */
    where: EntranceTestAttemptWhereUniqueInput
  }

  /**
   * EntranceTestAttempt findUniqueOrThrow
   */
  export type EntranceTestAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EntranceTestAttempt to fetch.
     */
    where: EntranceTestAttemptWhereUniqueInput
  }

  /**
   * EntranceTestAttempt findFirst
   */
  export type EntranceTestAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EntranceTestAttempt to fetch.
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceTestAttempts to fetch.
     */
    orderBy?: EntranceTestAttemptOrderByWithRelationInput | EntranceTestAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntranceTestAttempts.
     */
    cursor?: EntranceTestAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceTestAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceTestAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntranceTestAttempts.
     */
    distinct?: EntranceTestAttemptScalarFieldEnum | EntranceTestAttemptScalarFieldEnum[]
  }

  /**
   * EntranceTestAttempt findFirstOrThrow
   */
  export type EntranceTestAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EntranceTestAttempt to fetch.
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceTestAttempts to fetch.
     */
    orderBy?: EntranceTestAttemptOrderByWithRelationInput | EntranceTestAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EntranceTestAttempts.
     */
    cursor?: EntranceTestAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceTestAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceTestAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EntranceTestAttempts.
     */
    distinct?: EntranceTestAttemptScalarFieldEnum | EntranceTestAttemptScalarFieldEnum[]
  }

  /**
   * EntranceTestAttempt findMany
   */
  export type EntranceTestAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * Filter, which EntranceTestAttempts to fetch.
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EntranceTestAttempts to fetch.
     */
    orderBy?: EntranceTestAttemptOrderByWithRelationInput | EntranceTestAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EntranceTestAttempts.
     */
    cursor?: EntranceTestAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EntranceTestAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EntranceTestAttempts.
     */
    skip?: number
    distinct?: EntranceTestAttemptScalarFieldEnum | EntranceTestAttemptScalarFieldEnum[]
  }

  /**
   * EntranceTestAttempt create
   */
  export type EntranceTestAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * The data needed to create a EntranceTestAttempt.
     */
    data: XOR<EntranceTestAttemptCreateInput, EntranceTestAttemptUncheckedCreateInput>
  }

  /**
   * EntranceTestAttempt createMany
   */
  export type EntranceTestAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EntranceTestAttempts.
     */
    data: EntranceTestAttemptCreateManyInput | EntranceTestAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EntranceTestAttempt createManyAndReturn
   */
  export type EntranceTestAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * The data used to create many EntranceTestAttempts.
     */
    data: EntranceTestAttemptCreateManyInput | EntranceTestAttemptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EntranceTestAttempt update
   */
  export type EntranceTestAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * The data needed to update a EntranceTestAttempt.
     */
    data: XOR<EntranceTestAttemptUpdateInput, EntranceTestAttemptUncheckedUpdateInput>
    /**
     * Choose, which EntranceTestAttempt to update.
     */
    where: EntranceTestAttemptWhereUniqueInput
  }

  /**
   * EntranceTestAttempt updateMany
   */
  export type EntranceTestAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EntranceTestAttempts.
     */
    data: XOR<EntranceTestAttemptUpdateManyMutationInput, EntranceTestAttemptUncheckedUpdateManyInput>
    /**
     * Filter which EntranceTestAttempts to update
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * Limit how many EntranceTestAttempts to update.
     */
    limit?: number
  }

  /**
   * EntranceTestAttempt updateManyAndReturn
   */
  export type EntranceTestAttemptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * The data used to update EntranceTestAttempts.
     */
    data: XOR<EntranceTestAttemptUpdateManyMutationInput, EntranceTestAttemptUncheckedUpdateManyInput>
    /**
     * Filter which EntranceTestAttempts to update
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * Limit how many EntranceTestAttempts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EntranceTestAttempt upsert
   */
  export type EntranceTestAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * The filter to search for the EntranceTestAttempt to update in case it exists.
     */
    where: EntranceTestAttemptWhereUniqueInput
    /**
     * In case the EntranceTestAttempt found by the `where` argument doesn't exist, create a new EntranceTestAttempt with this data.
     */
    create: XOR<EntranceTestAttemptCreateInput, EntranceTestAttemptUncheckedCreateInput>
    /**
     * In case the EntranceTestAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EntranceTestAttemptUpdateInput, EntranceTestAttemptUncheckedUpdateInput>
  }

  /**
   * EntranceTestAttempt delete
   */
  export type EntranceTestAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
    /**
     * Filter which EntranceTestAttempt to delete.
     */
    where: EntranceTestAttemptWhereUniqueInput
  }

  /**
   * EntranceTestAttempt deleteMany
   */
  export type EntranceTestAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EntranceTestAttempts to delete
     */
    where?: EntranceTestAttemptWhereInput
    /**
     * Limit how many EntranceTestAttempts to delete.
     */
    limit?: number
  }

  /**
   * EntranceTestAttempt without action
   */
  export type EntranceTestAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntranceTestAttempt
     */
    select?: EntranceTestAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EntranceTestAttempt
     */
    omit?: EntranceTestAttemptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntranceTestAttemptInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFile
   */

  export type AggregateProjectFile = {
    _count: ProjectFileCountAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  export type ProjectFileMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    user_email: string | null
    file_path: string | null
    content: string | null
    is_directory: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectFileMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    user_email: string | null
    file_path: string | null
    content: string | null
    is_directory: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectFileCountAggregateOutputType = {
    id: number
    project_id: number
    user_email: number
    file_path: number
    content: number
    is_directory: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProjectFileMinAggregateInputType = {
    id?: true
    project_id?: true
    user_email?: true
    file_path?: true
    content?: true
    is_directory?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectFileMaxAggregateInputType = {
    id?: true
    project_id?: true
    user_email?: true
    file_path?: true
    content?: true
    is_directory?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectFileCountAggregateInputType = {
    id?: true
    project_id?: true
    user_email?: true
    file_path?: true
    content?: true
    is_directory?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProjectFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFile to aggregate.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFiles
    **/
    _count?: true | ProjectFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFileMaxAggregateInputType
  }

  export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFile[P]>
      : GetScalarType<T[P], AggregateProjectFile[P]>
  }




  export type ProjectFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithAggregationInput | ProjectFileOrderByWithAggregationInput[]
    by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum
    having?: ProjectFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFileCountAggregateInputType | true
    _min?: ProjectFileMinAggregateInputType
    _max?: ProjectFileMaxAggregateInputType
  }

  export type ProjectFileGroupByOutputType = {
    id: string
    project_id: string
    user_email: string
    file_path: string
    content: string
    is_directory: boolean
    created_at: Date
    updated_at: Date
    _count: ProjectFileCountAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    file_path?: boolean
    content?: boolean
    is_directory?: boolean
    created_at?: boolean
    updated_at?: boolean
    userProject?: boolean | UserProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    file_path?: boolean
    content?: boolean
    is_directory?: boolean
    created_at?: boolean
    updated_at?: boolean
    userProject?: boolean | UserProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    file_path?: boolean
    content?: boolean
    is_directory?: boolean
    created_at?: boolean
    updated_at?: boolean
    userProject?: boolean | UserProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectScalar = {
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    file_path?: boolean
    content?: boolean
    is_directory?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ProjectFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "project_id" | "user_email" | "file_path" | "content" | "is_directory" | "created_at" | "updated_at", ExtArgs["result"]["projectFile"]>
  export type ProjectFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProject?: boolean | UserProjectsDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProject?: boolean | UserProjectsDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProject?: boolean | UserProjectsDefaultArgs<ExtArgs>
  }

  export type $ProjectFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFile"
    objects: {
      userProject: Prisma.$UserProjectsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      user_email: string
      file_path: string
      content: string
      is_directory: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["projectFile"]>
    composites: {}
  }

  type ProjectFileGetPayload<S extends boolean | null | undefined | ProjectFileDefaultArgs> = $Result.GetResult<Prisma.$ProjectFilePayload, S>

  type ProjectFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectFileCountAggregateInputType | true
    }

  export interface ProjectFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFile'], meta: { name: 'ProjectFile' } }
    /**
     * Find zero or one ProjectFile that matches the filter.
     * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFileFindUniqueArgs>(args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFileFindFirstArgs>(args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany()
     * 
     * // Get first 10 ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFileFindManyArgs>(args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectFile.
     * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
     * @example
     * // Create one ProjectFile
     * const ProjectFile = await prisma.projectFile.create({
     *   data: {
     *     // ... data to create a ProjectFile
     *   }
     * })
     * 
     */
    create<T extends ProjectFileCreateArgs>(args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectFiles.
     * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFileCreateManyArgs>(args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFiles and returns the data saved in the database.
     * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectFile.
     * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
     * @example
     * // Delete one ProjectFile
     * const ProjectFile = await prisma.projectFile.delete({
     *   where: {
     *     // ... filter to delete one ProjectFile
     *   }
     * })
     * 
     */
    delete<T extends ProjectFileDeleteArgs>(args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectFile.
     * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
     * @example
     * // Update one ProjectFile
     * const projectFile = await prisma.projectFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFileUpdateArgs>(args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectFiles.
     * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
     * @example
     * // Delete a few ProjectFiles
     * const { count } = await prisma.projectFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFileDeleteManyArgs>(args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFileUpdateManyArgs>(args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles and returns the data updated in the database.
     * @param {ProjectFileUpdateManyAndReturnArgs} args - Arguments to update many ProjectFiles.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectFileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectFile.
     * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
     * @example
     * // Update or create a ProjectFile
     * const projectFile = await prisma.projectFile.upsert({
     *   create: {
     *     // ... data to create a ProjectFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFile we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFileUpsertArgs>(args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
     * @example
     * // Count the number of ProjectFiles
     * const count = await prisma.projectFile.count({
     *   where: {
     *     // ... the filter for the ProjectFiles we want to count
     *   }
     * })
    **/
    count<T extends ProjectFileCountArgs>(
      args?: Subset<T, ProjectFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectFileAggregateArgs>(args: Subset<T, ProjectFileAggregateArgs>): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>

    /**
     * Group by ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFileGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFile model
   */
  readonly fields: ProjectFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userProject<T extends UserProjectsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserProjectsDefaultArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectFile model
   */
  interface ProjectFileFieldRefs {
    readonly id: FieldRef<"ProjectFile", 'String'>
    readonly project_id: FieldRef<"ProjectFile", 'String'>
    readonly user_email: FieldRef<"ProjectFile", 'String'>
    readonly file_path: FieldRef<"ProjectFile", 'String'>
    readonly content: FieldRef<"ProjectFile", 'String'>
    readonly is_directory: FieldRef<"ProjectFile", 'Boolean'>
    readonly created_at: FieldRef<"ProjectFile", 'DateTime'>
    readonly updated_at: FieldRef<"ProjectFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFile findUnique
   */
  export type ProjectFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findUniqueOrThrow
   */
  export type ProjectFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findFirst
   */
  export type ProjectFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findFirstOrThrow
   */
  export type ProjectFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findMany
   */
  export type ProjectFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFiles to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile create
   */
  export type ProjectFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFile.
     */
    data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
  }

  /**
   * ProjectFile createMany
   */
  export type ProjectFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectFile createManyAndReturn
   */
  export type ProjectFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile update
   */
  export type ProjectFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFile.
     */
    data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
    /**
     * Choose, which ProjectFile to update.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile updateMany
   */
  export type ProjectFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
  }

  /**
   * ProjectFile updateManyAndReturn
   */
  export type ProjectFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile upsert
   */
  export type ProjectFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFile to update in case it exists.
     */
    where: ProjectFileWhereUniqueInput
    /**
     * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
     */
    create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
    /**
     * In case the ProjectFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
  }

  /**
   * ProjectFile delete
   */
  export type ProjectFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter which ProjectFile to delete.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile deleteMany
   */
  export type ProjectFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFiles to delete
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to delete.
     */
    limit?: number
  }

  /**
   * ProjectFile without action
   */
  export type ProjectFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
  }


  /**
   * Model UserProjects
   */

  export type AggregateUserProjects = {
    _count: UserProjectsCountAggregateOutputType | null
    _avg: UserProjectsAvgAggregateOutputType | null
    _sum: UserProjectsSumAggregateOutputType | null
    _min: UserProjectsMinAggregateOutputType | null
    _max: UserProjectsMaxAggregateOutputType | null
  }

  export type UserProjectsAvgAggregateOutputType = {
    current_phase: number | null
  }

  export type UserProjectsSumAggregateOutputType = {
    current_phase: number | null
  }

  export type UserProjectsMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    user_email: string | null
    status: $Enums.Status | null
    current_phase: number | null
    started_at: Date | null
    completed_at: Date | null
    archived: boolean | null
  }

  export type UserProjectsMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    user_email: string | null
    status: $Enums.Status | null
    current_phase: number | null
    started_at: Date | null
    completed_at: Date | null
    archived: boolean | null
  }

  export type UserProjectsCountAggregateOutputType = {
    id: number
    project_id: number
    user_email: number
    status: number
    current_phase: number
    started_at: number
    completed_at: number
    archived: number
    _all: number
  }


  export type UserProjectsAvgAggregateInputType = {
    current_phase?: true
  }

  export type UserProjectsSumAggregateInputType = {
    current_phase?: true
  }

  export type UserProjectsMinAggregateInputType = {
    id?: true
    project_id?: true
    user_email?: true
    status?: true
    current_phase?: true
    started_at?: true
    completed_at?: true
    archived?: true
  }

  export type UserProjectsMaxAggregateInputType = {
    id?: true
    project_id?: true
    user_email?: true
    status?: true
    current_phase?: true
    started_at?: true
    completed_at?: true
    archived?: true
  }

  export type UserProjectsCountAggregateInputType = {
    id?: true
    project_id?: true
    user_email?: true
    status?: true
    current_phase?: true
    started_at?: true
    completed_at?: true
    archived?: true
    _all?: true
  }

  export type UserProjectsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProjects to aggregate.
     */
    where?: UserProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProjects to fetch.
     */
    orderBy?: UserProjectsOrderByWithRelationInput | UserProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProjects
    **/
    _count?: true | UserProjectsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProjectsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProjectsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProjectsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProjectsMaxAggregateInputType
  }

  export type GetUserProjectsAggregateType<T extends UserProjectsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProjects]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProjects[P]>
      : GetScalarType<T[P], AggregateUserProjects[P]>
  }




  export type UserProjectsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProjectsWhereInput
    orderBy?: UserProjectsOrderByWithAggregationInput | UserProjectsOrderByWithAggregationInput[]
    by: UserProjectsScalarFieldEnum[] | UserProjectsScalarFieldEnum
    having?: UserProjectsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProjectsCountAggregateInputType | true
    _avg?: UserProjectsAvgAggregateInputType
    _sum?: UserProjectsSumAggregateInputType
    _min?: UserProjectsMinAggregateInputType
    _max?: UserProjectsMaxAggregateInputType
  }

  export type UserProjectsGroupByOutputType = {
    id: string
    project_id: string
    user_email: string
    status: $Enums.Status
    current_phase: number
    started_at: Date
    completed_at: Date | null
    archived: boolean | null
    _count: UserProjectsCountAggregateOutputType | null
    _avg: UserProjectsAvgAggregateOutputType | null
    _sum: UserProjectsSumAggregateOutputType | null
    _min: UserProjectsMinAggregateOutputType | null
    _max: UserProjectsMaxAggregateOutputType | null
  }

  type GetUserProjectsGroupByPayload<T extends UserProjectsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProjectsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProjectsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProjectsGroupByOutputType[P]>
            : GetScalarType<T[P], UserProjectsGroupByOutputType[P]>
        }
      >
    >


  export type UserProjectsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    status?: boolean
    current_phase?: boolean
    started_at?: boolean
    completed_at?: boolean
    archived?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    projects?: boolean | ProjectsDefaultArgs<ExtArgs>
    projectFiles?: boolean | UserProjects$projectFilesArgs<ExtArgs>
    _count?: boolean | UserProjectsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProjects"]>

  export type UserProjectsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    status?: boolean
    current_phase?: boolean
    started_at?: boolean
    completed_at?: boolean
    archived?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    projects?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProjects"]>

  export type UserProjectsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    status?: boolean
    current_phase?: boolean
    started_at?: boolean
    completed_at?: boolean
    archived?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    projects?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProjects"]>

  export type UserProjectsSelectScalar = {
    id?: boolean
    project_id?: boolean
    user_email?: boolean
    status?: boolean
    current_phase?: boolean
    started_at?: boolean
    completed_at?: boolean
    archived?: boolean
  }

  export type UserProjectsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "project_id" | "user_email" | "status" | "current_phase" | "started_at" | "completed_at" | "archived", ExtArgs["result"]["userProjects"]>
  export type UserProjectsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    projects?: boolean | ProjectsDefaultArgs<ExtArgs>
    projectFiles?: boolean | UserProjects$projectFilesArgs<ExtArgs>
    _count?: boolean | UserProjectsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserProjectsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    projects?: boolean | ProjectsDefaultArgs<ExtArgs>
  }
  export type UserProjectsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    projects?: boolean | ProjectsDefaultArgs<ExtArgs>
  }

  export type $UserProjectsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProjects"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      projects: Prisma.$ProjectsPayload<ExtArgs>
      projectFiles: Prisma.$ProjectFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      user_email: string
      status: $Enums.Status
      current_phase: number
      started_at: Date
      completed_at: Date | null
      archived: boolean | null
    }, ExtArgs["result"]["userProjects"]>
    composites: {}
  }

  type UserProjectsGetPayload<S extends boolean | null | undefined | UserProjectsDefaultArgs> = $Result.GetResult<Prisma.$UserProjectsPayload, S>

  type UserProjectsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProjectsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProjectsCountAggregateInputType | true
    }

  export interface UserProjectsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProjects'], meta: { name: 'UserProjects' } }
    /**
     * Find zero or one UserProjects that matches the filter.
     * @param {UserProjectsFindUniqueArgs} args - Arguments to find a UserProjects
     * @example
     * // Get one UserProjects
     * const userProjects = await prisma.userProjects.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProjectsFindUniqueArgs>(args: SelectSubset<T, UserProjectsFindUniqueArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProjects that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProjectsFindUniqueOrThrowArgs} args - Arguments to find a UserProjects
     * @example
     * // Get one UserProjects
     * const userProjects = await prisma.userProjects.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProjectsFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProjectsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsFindFirstArgs} args - Arguments to find a UserProjects
     * @example
     * // Get one UserProjects
     * const userProjects = await prisma.userProjects.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProjectsFindFirstArgs>(args?: SelectSubset<T, UserProjectsFindFirstArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProjects that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsFindFirstOrThrowArgs} args - Arguments to find a UserProjects
     * @example
     * // Get one UserProjects
     * const userProjects = await prisma.userProjects.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProjectsFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProjectsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProjects
     * const userProjects = await prisma.userProjects.findMany()
     * 
     * // Get first 10 UserProjects
     * const userProjects = await prisma.userProjects.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProjectsWithIdOnly = await prisma.userProjects.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProjectsFindManyArgs>(args?: SelectSubset<T, UserProjectsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProjects.
     * @param {UserProjectsCreateArgs} args - Arguments to create a UserProjects.
     * @example
     * // Create one UserProjects
     * const UserProjects = await prisma.userProjects.create({
     *   data: {
     *     // ... data to create a UserProjects
     *   }
     * })
     * 
     */
    create<T extends UserProjectsCreateArgs>(args: SelectSubset<T, UserProjectsCreateArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProjects.
     * @param {UserProjectsCreateManyArgs} args - Arguments to create many UserProjects.
     * @example
     * // Create many UserProjects
     * const userProjects = await prisma.userProjects.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProjectsCreateManyArgs>(args?: SelectSubset<T, UserProjectsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProjects and returns the data saved in the database.
     * @param {UserProjectsCreateManyAndReturnArgs} args - Arguments to create many UserProjects.
     * @example
     * // Create many UserProjects
     * const userProjects = await prisma.userProjects.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProjects and only return the `id`
     * const userProjectsWithIdOnly = await prisma.userProjects.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProjectsCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProjectsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProjects.
     * @param {UserProjectsDeleteArgs} args - Arguments to delete one UserProjects.
     * @example
     * // Delete one UserProjects
     * const UserProjects = await prisma.userProjects.delete({
     *   where: {
     *     // ... filter to delete one UserProjects
     *   }
     * })
     * 
     */
    delete<T extends UserProjectsDeleteArgs>(args: SelectSubset<T, UserProjectsDeleteArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProjects.
     * @param {UserProjectsUpdateArgs} args - Arguments to update one UserProjects.
     * @example
     * // Update one UserProjects
     * const userProjects = await prisma.userProjects.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProjectsUpdateArgs>(args: SelectSubset<T, UserProjectsUpdateArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProjects.
     * @param {UserProjectsDeleteManyArgs} args - Arguments to filter UserProjects to delete.
     * @example
     * // Delete a few UserProjects
     * const { count } = await prisma.userProjects.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProjectsDeleteManyArgs>(args?: SelectSubset<T, UserProjectsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProjects
     * const userProjects = await prisma.userProjects.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProjectsUpdateManyArgs>(args: SelectSubset<T, UserProjectsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProjects and returns the data updated in the database.
     * @param {UserProjectsUpdateManyAndReturnArgs} args - Arguments to update many UserProjects.
     * @example
     * // Update many UserProjects
     * const userProjects = await prisma.userProjects.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProjects and only return the `id`
     * const userProjectsWithIdOnly = await prisma.userProjects.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProjectsUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProjectsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProjects.
     * @param {UserProjectsUpsertArgs} args - Arguments to update or create a UserProjects.
     * @example
     * // Update or create a UserProjects
     * const userProjects = await prisma.userProjects.upsert({
     *   create: {
     *     // ... data to create a UserProjects
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProjects we want to update
     *   }
     * })
     */
    upsert<T extends UserProjectsUpsertArgs>(args: SelectSubset<T, UserProjectsUpsertArgs<ExtArgs>>): Prisma__UserProjectsClient<$Result.GetResult<Prisma.$UserProjectsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsCountArgs} args - Arguments to filter UserProjects to count.
     * @example
     * // Count the number of UserProjects
     * const count = await prisma.userProjects.count({
     *   where: {
     *     // ... the filter for the UserProjects we want to count
     *   }
     * })
    **/
    count<T extends UserProjectsCountArgs>(
      args?: Subset<T, UserProjectsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProjectsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProjectsAggregateArgs>(args: Subset<T, UserProjectsAggregateArgs>): Prisma.PrismaPromise<GetUserProjectsAggregateType<T>>

    /**
     * Group by UserProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProjectsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProjectsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProjectsGroupByArgs['orderBy'] }
        : { orderBy?: UserProjectsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProjectsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProjectsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProjects model
   */
  readonly fields: UserProjectsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProjects.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProjectsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    projects<T extends ProjectsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectsDefaultArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    projectFiles<T extends UserProjects$projectFilesArgs<ExtArgs> = {}>(args?: Subset<T, UserProjects$projectFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProjects model
   */
  interface UserProjectsFieldRefs {
    readonly id: FieldRef<"UserProjects", 'String'>
    readonly project_id: FieldRef<"UserProjects", 'String'>
    readonly user_email: FieldRef<"UserProjects", 'String'>
    readonly status: FieldRef<"UserProjects", 'Status'>
    readonly current_phase: FieldRef<"UserProjects", 'Int'>
    readonly started_at: FieldRef<"UserProjects", 'DateTime'>
    readonly completed_at: FieldRef<"UserProjects", 'DateTime'>
    readonly archived: FieldRef<"UserProjects", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UserProjects findUnique
   */
  export type UserProjectsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * Filter, which UserProjects to fetch.
     */
    where: UserProjectsWhereUniqueInput
  }

  /**
   * UserProjects findUniqueOrThrow
   */
  export type UserProjectsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * Filter, which UserProjects to fetch.
     */
    where: UserProjectsWhereUniqueInput
  }

  /**
   * UserProjects findFirst
   */
  export type UserProjectsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * Filter, which UserProjects to fetch.
     */
    where?: UserProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProjects to fetch.
     */
    orderBy?: UserProjectsOrderByWithRelationInput | UserProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProjects.
     */
    cursor?: UserProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProjects.
     */
    distinct?: UserProjectsScalarFieldEnum | UserProjectsScalarFieldEnum[]
  }

  /**
   * UserProjects findFirstOrThrow
   */
  export type UserProjectsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * Filter, which UserProjects to fetch.
     */
    where?: UserProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProjects to fetch.
     */
    orderBy?: UserProjectsOrderByWithRelationInput | UserProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProjects.
     */
    cursor?: UserProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProjects.
     */
    distinct?: UserProjectsScalarFieldEnum | UserProjectsScalarFieldEnum[]
  }

  /**
   * UserProjects findMany
   */
  export type UserProjectsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * Filter, which UserProjects to fetch.
     */
    where?: UserProjectsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProjects to fetch.
     */
    orderBy?: UserProjectsOrderByWithRelationInput | UserProjectsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProjects.
     */
    cursor?: UserProjectsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProjects.
     */
    skip?: number
    distinct?: UserProjectsScalarFieldEnum | UserProjectsScalarFieldEnum[]
  }

  /**
   * UserProjects create
   */
  export type UserProjectsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProjects.
     */
    data: XOR<UserProjectsCreateInput, UserProjectsUncheckedCreateInput>
  }

  /**
   * UserProjects createMany
   */
  export type UserProjectsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProjects.
     */
    data: UserProjectsCreateManyInput | UserProjectsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProjects createManyAndReturn
   */
  export type UserProjectsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * The data used to create many UserProjects.
     */
    data: UserProjectsCreateManyInput | UserProjectsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProjects update
   */
  export type UserProjectsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProjects.
     */
    data: XOR<UserProjectsUpdateInput, UserProjectsUncheckedUpdateInput>
    /**
     * Choose, which UserProjects to update.
     */
    where: UserProjectsWhereUniqueInput
  }

  /**
   * UserProjects updateMany
   */
  export type UserProjectsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProjects.
     */
    data: XOR<UserProjectsUpdateManyMutationInput, UserProjectsUncheckedUpdateManyInput>
    /**
     * Filter which UserProjects to update
     */
    where?: UserProjectsWhereInput
    /**
     * Limit how many UserProjects to update.
     */
    limit?: number
  }

  /**
   * UserProjects updateManyAndReturn
   */
  export type UserProjectsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * The data used to update UserProjects.
     */
    data: XOR<UserProjectsUpdateManyMutationInput, UserProjectsUncheckedUpdateManyInput>
    /**
     * Filter which UserProjects to update
     */
    where?: UserProjectsWhereInput
    /**
     * Limit how many UserProjects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProjects upsert
   */
  export type UserProjectsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProjects to update in case it exists.
     */
    where: UserProjectsWhereUniqueInput
    /**
     * In case the UserProjects found by the `where` argument doesn't exist, create a new UserProjects with this data.
     */
    create: XOR<UserProjectsCreateInput, UserProjectsUncheckedCreateInput>
    /**
     * In case the UserProjects was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProjectsUpdateInput, UserProjectsUncheckedUpdateInput>
  }

  /**
   * UserProjects delete
   */
  export type UserProjectsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
    /**
     * Filter which UserProjects to delete.
     */
    where: UserProjectsWhereUniqueInput
  }

  /**
   * UserProjects deleteMany
   */
  export type UserProjectsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProjects to delete
     */
    where?: UserProjectsWhereInput
    /**
     * Limit how many UserProjects to delete.
     */
    limit?: number
  }

  /**
   * UserProjects.projectFiles
   */
  export type UserProjects$projectFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * UserProjects without action
   */
  export type UserProjectsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProjects
     */
    select?: UserProjectsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProjects
     */
    omit?: UserProjectsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProjectsInclude<ExtArgs> | null
  }


  /**
   * Model LearningPhase
   */

  export type AggregateLearningPhase = {
    _count: LearningPhaseCountAggregateOutputType | null
    _avg: LearningPhaseAvgAggregateOutputType | null
    _sum: LearningPhaseSumAggregateOutputType | null
    _min: LearningPhaseMinAggregateOutputType | null
    _max: LearningPhaseMaxAggregateOutputType | null
  }

  export type LearningPhaseAvgAggregateOutputType = {
    phase_number: number | null
    estimated_minutes: number | null
  }

  export type LearningPhaseSumAggregateOutputType = {
    phase_number: number | null
    estimated_minutes: number | null
  }

  export type LearningPhaseMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    title: string | null
    description: string | null
    long_description: string | null
    phase_number: number | null
    phase_status: $Enums.PhaseStatus | null
    estimated_minutes: number | null
    createdAt: Date | null
  }

  export type LearningPhaseMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    title: string | null
    description: string | null
    long_description: string | null
    phase_number: number | null
    phase_status: $Enums.PhaseStatus | null
    estimated_minutes: number | null
    createdAt: Date | null
  }

  export type LearningPhaseCountAggregateOutputType = {
    id: number
    project_id: number
    title: number
    description: number
    long_description: number
    concepts: number
    goal: number
    phase_number: number
    phase_status: number
    estimated_minutes: number
    createdAt: number
    _all: number
  }


  export type LearningPhaseAvgAggregateInputType = {
    phase_number?: true
    estimated_minutes?: true
  }

  export type LearningPhaseSumAggregateInputType = {
    phase_number?: true
    estimated_minutes?: true
  }

  export type LearningPhaseMinAggregateInputType = {
    id?: true
    project_id?: true
    title?: true
    description?: true
    long_description?: true
    phase_number?: true
    phase_status?: true
    estimated_minutes?: true
    createdAt?: true
  }

  export type LearningPhaseMaxAggregateInputType = {
    id?: true
    project_id?: true
    title?: true
    description?: true
    long_description?: true
    phase_number?: true
    phase_status?: true
    estimated_minutes?: true
    createdAt?: true
  }

  export type LearningPhaseCountAggregateInputType = {
    id?: true
    project_id?: true
    title?: true
    description?: true
    long_description?: true
    concepts?: true
    goal?: true
    phase_number?: true
    phase_status?: true
    estimated_minutes?: true
    createdAt?: true
    _all?: true
  }

  export type LearningPhaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LearningPhase to aggregate.
     */
    where?: LearningPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LearningPhases to fetch.
     */
    orderBy?: LearningPhaseOrderByWithRelationInput | LearningPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LearningPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LearningPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LearningPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LearningPhases
    **/
    _count?: true | LearningPhaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LearningPhaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LearningPhaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LearningPhaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LearningPhaseMaxAggregateInputType
  }

  export type GetLearningPhaseAggregateType<T extends LearningPhaseAggregateArgs> = {
        [P in keyof T & keyof AggregateLearningPhase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLearningPhase[P]>
      : GetScalarType<T[P], AggregateLearningPhase[P]>
  }




  export type LearningPhaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LearningPhaseWhereInput
    orderBy?: LearningPhaseOrderByWithAggregationInput | LearningPhaseOrderByWithAggregationInput[]
    by: LearningPhaseScalarFieldEnum[] | LearningPhaseScalarFieldEnum
    having?: LearningPhaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LearningPhaseCountAggregateInputType | true
    _avg?: LearningPhaseAvgAggregateInputType
    _sum?: LearningPhaseSumAggregateInputType
    _min?: LearningPhaseMinAggregateInputType
    _max?: LearningPhaseMaxAggregateInputType
  }

  export type LearningPhaseGroupByOutputType = {
    id: string
    project_id: string
    title: string
    description: string
    long_description: string
    concepts: string[]
    goal: JsonValue | null
    phase_number: number
    phase_status: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt: Date
    _count: LearningPhaseCountAggregateOutputType | null
    _avg: LearningPhaseAvgAggregateOutputType | null
    _sum: LearningPhaseSumAggregateOutputType | null
    _min: LearningPhaseMinAggregateOutputType | null
    _max: LearningPhaseMaxAggregateOutputType | null
  }

  type GetLearningPhaseGroupByPayload<T extends LearningPhaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LearningPhaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LearningPhaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LearningPhaseGroupByOutputType[P]>
            : GetScalarType<T[P], LearningPhaseGroupByOutputType[P]>
        }
      >
    >


  export type LearningPhaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    title?: boolean
    description?: boolean
    long_description?: boolean
    concepts?: boolean
    goal?: boolean
    phase_number?: boolean
    phase_status?: boolean
    estimated_minutes?: boolean
    createdAt?: boolean
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
    resources?: boolean | LearningPhase$resourcesArgs<ExtArgs>
    knowledgeChecks?: boolean | LearningPhase$knowledgeChecksArgs<ExtArgs>
    _count?: boolean | LearningPhaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["learningPhase"]>

  export type LearningPhaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    title?: boolean
    description?: boolean
    long_description?: boolean
    concepts?: boolean
    goal?: boolean
    phase_number?: boolean
    phase_status?: boolean
    estimated_minutes?: boolean
    createdAt?: boolean
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["learningPhase"]>

  export type LearningPhaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    title?: boolean
    description?: boolean
    long_description?: boolean
    concepts?: boolean
    goal?: boolean
    phase_number?: boolean
    phase_status?: boolean
    estimated_minutes?: boolean
    createdAt?: boolean
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["learningPhase"]>

  export type LearningPhaseSelectScalar = {
    id?: boolean
    project_id?: boolean
    title?: boolean
    description?: boolean
    long_description?: boolean
    concepts?: boolean
    goal?: boolean
    phase_number?: boolean
    phase_status?: boolean
    estimated_minutes?: boolean
    createdAt?: boolean
  }

  export type LearningPhaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "project_id" | "title" | "description" | "long_description" | "concepts" | "goal" | "phase_number" | "phase_status" | "estimated_minutes" | "createdAt", ExtArgs["result"]["learningPhase"]>
  export type LearningPhaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
    resources?: boolean | LearningPhase$resourcesArgs<ExtArgs>
    knowledgeChecks?: boolean | LearningPhase$knowledgeChecksArgs<ExtArgs>
    _count?: boolean | LearningPhaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LearningPhaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }
  export type LearningPhaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectsDefaultArgs<ExtArgs>
  }

  export type $LearningPhasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LearningPhase"
    objects: {
      project: Prisma.$ProjectsPayload<ExtArgs>
      resources: Prisma.$ResourcesPayload<ExtArgs>[]
      knowledgeChecks: Prisma.$KnowledgeChecksPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      title: string
      description: string
      long_description: string
      concepts: string[]
      goal: Prisma.JsonValue | null
      phase_number: number
      phase_status: $Enums.PhaseStatus
      estimated_minutes: number
      createdAt: Date
    }, ExtArgs["result"]["learningPhase"]>
    composites: {}
  }

  type LearningPhaseGetPayload<S extends boolean | null | undefined | LearningPhaseDefaultArgs> = $Result.GetResult<Prisma.$LearningPhasePayload, S>

  type LearningPhaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LearningPhaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LearningPhaseCountAggregateInputType | true
    }

  export interface LearningPhaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LearningPhase'], meta: { name: 'LearningPhase' } }
    /**
     * Find zero or one LearningPhase that matches the filter.
     * @param {LearningPhaseFindUniqueArgs} args - Arguments to find a LearningPhase
     * @example
     * // Get one LearningPhase
     * const learningPhase = await prisma.learningPhase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LearningPhaseFindUniqueArgs>(args: SelectSubset<T, LearningPhaseFindUniqueArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LearningPhase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LearningPhaseFindUniqueOrThrowArgs} args - Arguments to find a LearningPhase
     * @example
     * // Get one LearningPhase
     * const learningPhase = await prisma.learningPhase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LearningPhaseFindUniqueOrThrowArgs>(args: SelectSubset<T, LearningPhaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LearningPhase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseFindFirstArgs} args - Arguments to find a LearningPhase
     * @example
     * // Get one LearningPhase
     * const learningPhase = await prisma.learningPhase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LearningPhaseFindFirstArgs>(args?: SelectSubset<T, LearningPhaseFindFirstArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LearningPhase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseFindFirstOrThrowArgs} args - Arguments to find a LearningPhase
     * @example
     * // Get one LearningPhase
     * const learningPhase = await prisma.learningPhase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LearningPhaseFindFirstOrThrowArgs>(args?: SelectSubset<T, LearningPhaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LearningPhases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LearningPhases
     * const learningPhases = await prisma.learningPhase.findMany()
     * 
     * // Get first 10 LearningPhases
     * const learningPhases = await prisma.learningPhase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const learningPhaseWithIdOnly = await prisma.learningPhase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LearningPhaseFindManyArgs>(args?: SelectSubset<T, LearningPhaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LearningPhase.
     * @param {LearningPhaseCreateArgs} args - Arguments to create a LearningPhase.
     * @example
     * // Create one LearningPhase
     * const LearningPhase = await prisma.learningPhase.create({
     *   data: {
     *     // ... data to create a LearningPhase
     *   }
     * })
     * 
     */
    create<T extends LearningPhaseCreateArgs>(args: SelectSubset<T, LearningPhaseCreateArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LearningPhases.
     * @param {LearningPhaseCreateManyArgs} args - Arguments to create many LearningPhases.
     * @example
     * // Create many LearningPhases
     * const learningPhase = await prisma.learningPhase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LearningPhaseCreateManyArgs>(args?: SelectSubset<T, LearningPhaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LearningPhases and returns the data saved in the database.
     * @param {LearningPhaseCreateManyAndReturnArgs} args - Arguments to create many LearningPhases.
     * @example
     * // Create many LearningPhases
     * const learningPhase = await prisma.learningPhase.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LearningPhases and only return the `id`
     * const learningPhaseWithIdOnly = await prisma.learningPhase.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LearningPhaseCreateManyAndReturnArgs>(args?: SelectSubset<T, LearningPhaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LearningPhase.
     * @param {LearningPhaseDeleteArgs} args - Arguments to delete one LearningPhase.
     * @example
     * // Delete one LearningPhase
     * const LearningPhase = await prisma.learningPhase.delete({
     *   where: {
     *     // ... filter to delete one LearningPhase
     *   }
     * })
     * 
     */
    delete<T extends LearningPhaseDeleteArgs>(args: SelectSubset<T, LearningPhaseDeleteArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LearningPhase.
     * @param {LearningPhaseUpdateArgs} args - Arguments to update one LearningPhase.
     * @example
     * // Update one LearningPhase
     * const learningPhase = await prisma.learningPhase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LearningPhaseUpdateArgs>(args: SelectSubset<T, LearningPhaseUpdateArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LearningPhases.
     * @param {LearningPhaseDeleteManyArgs} args - Arguments to filter LearningPhases to delete.
     * @example
     * // Delete a few LearningPhases
     * const { count } = await prisma.learningPhase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LearningPhaseDeleteManyArgs>(args?: SelectSubset<T, LearningPhaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LearningPhases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LearningPhases
     * const learningPhase = await prisma.learningPhase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LearningPhaseUpdateManyArgs>(args: SelectSubset<T, LearningPhaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LearningPhases and returns the data updated in the database.
     * @param {LearningPhaseUpdateManyAndReturnArgs} args - Arguments to update many LearningPhases.
     * @example
     * // Update many LearningPhases
     * const learningPhase = await prisma.learningPhase.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LearningPhases and only return the `id`
     * const learningPhaseWithIdOnly = await prisma.learningPhase.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LearningPhaseUpdateManyAndReturnArgs>(args: SelectSubset<T, LearningPhaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LearningPhase.
     * @param {LearningPhaseUpsertArgs} args - Arguments to update or create a LearningPhase.
     * @example
     * // Update or create a LearningPhase
     * const learningPhase = await prisma.learningPhase.upsert({
     *   create: {
     *     // ... data to create a LearningPhase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LearningPhase we want to update
     *   }
     * })
     */
    upsert<T extends LearningPhaseUpsertArgs>(args: SelectSubset<T, LearningPhaseUpsertArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LearningPhases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseCountArgs} args - Arguments to filter LearningPhases to count.
     * @example
     * // Count the number of LearningPhases
     * const count = await prisma.learningPhase.count({
     *   where: {
     *     // ... the filter for the LearningPhases we want to count
     *   }
     * })
    **/
    count<T extends LearningPhaseCountArgs>(
      args?: Subset<T, LearningPhaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LearningPhaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LearningPhase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LearningPhaseAggregateArgs>(args: Subset<T, LearningPhaseAggregateArgs>): Prisma.PrismaPromise<GetLearningPhaseAggregateType<T>>

    /**
     * Group by LearningPhase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LearningPhaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LearningPhaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LearningPhaseGroupByArgs['orderBy'] }
        : { orderBy?: LearningPhaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LearningPhaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLearningPhaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LearningPhase model
   */
  readonly fields: LearningPhaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LearningPhase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LearningPhaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectsDefaultArgs<ExtArgs>>): Prisma__ProjectsClient<$Result.GetResult<Prisma.$ProjectsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resources<T extends LearningPhase$resourcesArgs<ExtArgs> = {}>(args?: Subset<T, LearningPhase$resourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    knowledgeChecks<T extends LearningPhase$knowledgeChecksArgs<ExtArgs> = {}>(args?: Subset<T, LearningPhase$knowledgeChecksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LearningPhase model
   */
  interface LearningPhaseFieldRefs {
    readonly id: FieldRef<"LearningPhase", 'String'>
    readonly project_id: FieldRef<"LearningPhase", 'String'>
    readonly title: FieldRef<"LearningPhase", 'String'>
    readonly description: FieldRef<"LearningPhase", 'String'>
    readonly long_description: FieldRef<"LearningPhase", 'String'>
    readonly concepts: FieldRef<"LearningPhase", 'String[]'>
    readonly goal: FieldRef<"LearningPhase", 'Json'>
    readonly phase_number: FieldRef<"LearningPhase", 'Int'>
    readonly phase_status: FieldRef<"LearningPhase", 'PhaseStatus'>
    readonly estimated_minutes: FieldRef<"LearningPhase", 'Int'>
    readonly createdAt: FieldRef<"LearningPhase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LearningPhase findUnique
   */
  export type LearningPhaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * Filter, which LearningPhase to fetch.
     */
    where: LearningPhaseWhereUniqueInput
  }

  /**
   * LearningPhase findUniqueOrThrow
   */
  export type LearningPhaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * Filter, which LearningPhase to fetch.
     */
    where: LearningPhaseWhereUniqueInput
  }

  /**
   * LearningPhase findFirst
   */
  export type LearningPhaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * Filter, which LearningPhase to fetch.
     */
    where?: LearningPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LearningPhases to fetch.
     */
    orderBy?: LearningPhaseOrderByWithRelationInput | LearningPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LearningPhases.
     */
    cursor?: LearningPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LearningPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LearningPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LearningPhases.
     */
    distinct?: LearningPhaseScalarFieldEnum | LearningPhaseScalarFieldEnum[]
  }

  /**
   * LearningPhase findFirstOrThrow
   */
  export type LearningPhaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * Filter, which LearningPhase to fetch.
     */
    where?: LearningPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LearningPhases to fetch.
     */
    orderBy?: LearningPhaseOrderByWithRelationInput | LearningPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LearningPhases.
     */
    cursor?: LearningPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LearningPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LearningPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LearningPhases.
     */
    distinct?: LearningPhaseScalarFieldEnum | LearningPhaseScalarFieldEnum[]
  }

  /**
   * LearningPhase findMany
   */
  export type LearningPhaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * Filter, which LearningPhases to fetch.
     */
    where?: LearningPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LearningPhases to fetch.
     */
    orderBy?: LearningPhaseOrderByWithRelationInput | LearningPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LearningPhases.
     */
    cursor?: LearningPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LearningPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LearningPhases.
     */
    skip?: number
    distinct?: LearningPhaseScalarFieldEnum | LearningPhaseScalarFieldEnum[]
  }

  /**
   * LearningPhase create
   */
  export type LearningPhaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * The data needed to create a LearningPhase.
     */
    data: XOR<LearningPhaseCreateInput, LearningPhaseUncheckedCreateInput>
  }

  /**
   * LearningPhase createMany
   */
  export type LearningPhaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LearningPhases.
     */
    data: LearningPhaseCreateManyInput | LearningPhaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LearningPhase createManyAndReturn
   */
  export type LearningPhaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * The data used to create many LearningPhases.
     */
    data: LearningPhaseCreateManyInput | LearningPhaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LearningPhase update
   */
  export type LearningPhaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * The data needed to update a LearningPhase.
     */
    data: XOR<LearningPhaseUpdateInput, LearningPhaseUncheckedUpdateInput>
    /**
     * Choose, which LearningPhase to update.
     */
    where: LearningPhaseWhereUniqueInput
  }

  /**
   * LearningPhase updateMany
   */
  export type LearningPhaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LearningPhases.
     */
    data: XOR<LearningPhaseUpdateManyMutationInput, LearningPhaseUncheckedUpdateManyInput>
    /**
     * Filter which LearningPhases to update
     */
    where?: LearningPhaseWhereInput
    /**
     * Limit how many LearningPhases to update.
     */
    limit?: number
  }

  /**
   * LearningPhase updateManyAndReturn
   */
  export type LearningPhaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * The data used to update LearningPhases.
     */
    data: XOR<LearningPhaseUpdateManyMutationInput, LearningPhaseUncheckedUpdateManyInput>
    /**
     * Filter which LearningPhases to update
     */
    where?: LearningPhaseWhereInput
    /**
     * Limit how many LearningPhases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LearningPhase upsert
   */
  export type LearningPhaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * The filter to search for the LearningPhase to update in case it exists.
     */
    where: LearningPhaseWhereUniqueInput
    /**
     * In case the LearningPhase found by the `where` argument doesn't exist, create a new LearningPhase with this data.
     */
    create: XOR<LearningPhaseCreateInput, LearningPhaseUncheckedCreateInput>
    /**
     * In case the LearningPhase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LearningPhaseUpdateInput, LearningPhaseUncheckedUpdateInput>
  }

  /**
   * LearningPhase delete
   */
  export type LearningPhaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
    /**
     * Filter which LearningPhase to delete.
     */
    where: LearningPhaseWhereUniqueInput
  }

  /**
   * LearningPhase deleteMany
   */
  export type LearningPhaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LearningPhases to delete
     */
    where?: LearningPhaseWhereInput
    /**
     * Limit how many LearningPhases to delete.
     */
    limit?: number
  }

  /**
   * LearningPhase.resources
   */
  export type LearningPhase$resourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    where?: ResourcesWhereInput
    orderBy?: ResourcesOrderByWithRelationInput | ResourcesOrderByWithRelationInput[]
    cursor?: ResourcesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResourcesScalarFieldEnum | ResourcesScalarFieldEnum[]
  }

  /**
   * LearningPhase.knowledgeChecks
   */
  export type LearningPhase$knowledgeChecksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    where?: KnowledgeChecksWhereInput
    orderBy?: KnowledgeChecksOrderByWithRelationInput | KnowledgeChecksOrderByWithRelationInput[]
    cursor?: KnowledgeChecksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KnowledgeChecksScalarFieldEnum | KnowledgeChecksScalarFieldEnum[]
  }

  /**
   * LearningPhase without action
   */
  export type LearningPhaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LearningPhase
     */
    select?: LearningPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LearningPhase
     */
    omit?: LearningPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LearningPhaseInclude<ExtArgs> | null
  }


  /**
   * Model KnowledgeChecks
   */

  export type AggregateKnowledgeChecks = {
    _count: KnowledgeChecksCountAggregateOutputType | null
    _min: KnowledgeChecksMinAggregateOutputType | null
    _max: KnowledgeChecksMaxAggregateOutputType | null
  }

  export type KnowledgeChecksMinAggregateOutputType = {
    id: string | null
    phase_id: string | null
    question: string | null
    correct_answer: string | null
    explanation: string | null
    question_type: $Enums.Question_Type | null
  }

  export type KnowledgeChecksMaxAggregateOutputType = {
    id: string | null
    phase_id: string | null
    question: string | null
    correct_answer: string | null
    explanation: string | null
    question_type: $Enums.Question_Type | null
  }

  export type KnowledgeChecksCountAggregateOutputType = {
    id: number
    phase_id: number
    question: number
    correct_answer: number
    explanation: number
    question_type: number
    _all: number
  }


  export type KnowledgeChecksMinAggregateInputType = {
    id?: true
    phase_id?: true
    question?: true
    correct_answer?: true
    explanation?: true
    question_type?: true
  }

  export type KnowledgeChecksMaxAggregateInputType = {
    id?: true
    phase_id?: true
    question?: true
    correct_answer?: true
    explanation?: true
    question_type?: true
  }

  export type KnowledgeChecksCountAggregateInputType = {
    id?: true
    phase_id?: true
    question?: true
    correct_answer?: true
    explanation?: true
    question_type?: true
    _all?: true
  }

  export type KnowledgeChecksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeChecks to aggregate.
     */
    where?: KnowledgeChecksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChecks to fetch.
     */
    orderBy?: KnowledgeChecksOrderByWithRelationInput | KnowledgeChecksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KnowledgeChecksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KnowledgeChecks
    **/
    _count?: true | KnowledgeChecksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeChecksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeChecksMaxAggregateInputType
  }

  export type GetKnowledgeChecksAggregateType<T extends KnowledgeChecksAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledgeChecks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledgeChecks[P]>
      : GetScalarType<T[P], AggregateKnowledgeChecks[P]>
  }




  export type KnowledgeChecksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeChecksWhereInput
    orderBy?: KnowledgeChecksOrderByWithAggregationInput | KnowledgeChecksOrderByWithAggregationInput[]
    by: KnowledgeChecksScalarFieldEnum[] | KnowledgeChecksScalarFieldEnum
    having?: KnowledgeChecksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeChecksCountAggregateInputType | true
    _min?: KnowledgeChecksMinAggregateInputType
    _max?: KnowledgeChecksMaxAggregateInputType
  }

  export type KnowledgeChecksGroupByOutputType = {
    id: string
    phase_id: string
    question: string
    correct_answer: string | null
    explanation: string
    question_type: $Enums.Question_Type
    _count: KnowledgeChecksCountAggregateOutputType | null
    _min: KnowledgeChecksMinAggregateOutputType | null
    _max: KnowledgeChecksMaxAggregateOutputType | null
  }

  type GetKnowledgeChecksGroupByPayload<T extends KnowledgeChecksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeChecksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeChecksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeChecksGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeChecksGroupByOutputType[P]>
        }
      >
    >


  export type KnowledgeChecksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase_id?: boolean
    question?: boolean
    correct_answer?: boolean
    explanation?: boolean
    question_type?: boolean
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeChecks"]>

  export type KnowledgeChecksSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase_id?: boolean
    question?: boolean
    correct_answer?: boolean
    explanation?: boolean
    question_type?: boolean
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeChecks"]>

  export type KnowledgeChecksSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase_id?: boolean
    question?: boolean
    correct_answer?: boolean
    explanation?: boolean
    question_type?: boolean
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeChecks"]>

  export type KnowledgeChecksSelectScalar = {
    id?: boolean
    phase_id?: boolean
    question?: boolean
    correct_answer?: boolean
    explanation?: boolean
    question_type?: boolean
  }

  export type KnowledgeChecksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phase_id" | "question" | "correct_answer" | "explanation" | "question_type", ExtArgs["result"]["knowledgeChecks"]>
  export type KnowledgeChecksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }
  export type KnowledgeChecksIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }
  export type KnowledgeChecksIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }

  export type $KnowledgeChecksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KnowledgeChecks"
    objects: {
      learningPhase: Prisma.$LearningPhasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phase_id: string
      question: string
      correct_answer: string | null
      explanation: string
      question_type: $Enums.Question_Type
    }, ExtArgs["result"]["knowledgeChecks"]>
    composites: {}
  }

  type KnowledgeChecksGetPayload<S extends boolean | null | undefined | KnowledgeChecksDefaultArgs> = $Result.GetResult<Prisma.$KnowledgeChecksPayload, S>

  type KnowledgeChecksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KnowledgeChecksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KnowledgeChecksCountAggregateInputType | true
    }

  export interface KnowledgeChecksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeChecks'], meta: { name: 'KnowledgeChecks' } }
    /**
     * Find zero or one KnowledgeChecks that matches the filter.
     * @param {KnowledgeChecksFindUniqueArgs} args - Arguments to find a KnowledgeChecks
     * @example
     * // Get one KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KnowledgeChecksFindUniqueArgs>(args: SelectSubset<T, KnowledgeChecksFindUniqueArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KnowledgeChecks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KnowledgeChecksFindUniqueOrThrowArgs} args - Arguments to find a KnowledgeChecks
     * @example
     * // Get one KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KnowledgeChecksFindUniqueOrThrowArgs>(args: SelectSubset<T, KnowledgeChecksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeChecks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksFindFirstArgs} args - Arguments to find a KnowledgeChecks
     * @example
     * // Get one KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KnowledgeChecksFindFirstArgs>(args?: SelectSubset<T, KnowledgeChecksFindFirstArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeChecks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksFindFirstOrThrowArgs} args - Arguments to find a KnowledgeChecks
     * @example
     * // Get one KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KnowledgeChecksFindFirstOrThrowArgs>(args?: SelectSubset<T, KnowledgeChecksFindFirstOrThrowArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KnowledgeChecks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.findMany()
     * 
     * // Get first 10 KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeChecksWithIdOnly = await prisma.knowledgeChecks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KnowledgeChecksFindManyArgs>(args?: SelectSubset<T, KnowledgeChecksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KnowledgeChecks.
     * @param {KnowledgeChecksCreateArgs} args - Arguments to create a KnowledgeChecks.
     * @example
     * // Create one KnowledgeChecks
     * const KnowledgeChecks = await prisma.knowledgeChecks.create({
     *   data: {
     *     // ... data to create a KnowledgeChecks
     *   }
     * })
     * 
     */
    create<T extends KnowledgeChecksCreateArgs>(args: SelectSubset<T, KnowledgeChecksCreateArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KnowledgeChecks.
     * @param {KnowledgeChecksCreateManyArgs} args - Arguments to create many KnowledgeChecks.
     * @example
     * // Create many KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KnowledgeChecksCreateManyArgs>(args?: SelectSubset<T, KnowledgeChecksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KnowledgeChecks and returns the data saved in the database.
     * @param {KnowledgeChecksCreateManyAndReturnArgs} args - Arguments to create many KnowledgeChecks.
     * @example
     * // Create many KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KnowledgeChecks and only return the `id`
     * const knowledgeChecksWithIdOnly = await prisma.knowledgeChecks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KnowledgeChecksCreateManyAndReturnArgs>(args?: SelectSubset<T, KnowledgeChecksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KnowledgeChecks.
     * @param {KnowledgeChecksDeleteArgs} args - Arguments to delete one KnowledgeChecks.
     * @example
     * // Delete one KnowledgeChecks
     * const KnowledgeChecks = await prisma.knowledgeChecks.delete({
     *   where: {
     *     // ... filter to delete one KnowledgeChecks
     *   }
     * })
     * 
     */
    delete<T extends KnowledgeChecksDeleteArgs>(args: SelectSubset<T, KnowledgeChecksDeleteArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KnowledgeChecks.
     * @param {KnowledgeChecksUpdateArgs} args - Arguments to update one KnowledgeChecks.
     * @example
     * // Update one KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KnowledgeChecksUpdateArgs>(args: SelectSubset<T, KnowledgeChecksUpdateArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KnowledgeChecks.
     * @param {KnowledgeChecksDeleteManyArgs} args - Arguments to filter KnowledgeChecks to delete.
     * @example
     * // Delete a few KnowledgeChecks
     * const { count } = await prisma.knowledgeChecks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KnowledgeChecksDeleteManyArgs>(args?: SelectSubset<T, KnowledgeChecksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KnowledgeChecksUpdateManyArgs>(args: SelectSubset<T, KnowledgeChecksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeChecks and returns the data updated in the database.
     * @param {KnowledgeChecksUpdateManyAndReturnArgs} args - Arguments to update many KnowledgeChecks.
     * @example
     * // Update many KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KnowledgeChecks and only return the `id`
     * const knowledgeChecksWithIdOnly = await prisma.knowledgeChecks.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KnowledgeChecksUpdateManyAndReturnArgs>(args: SelectSubset<T, KnowledgeChecksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KnowledgeChecks.
     * @param {KnowledgeChecksUpsertArgs} args - Arguments to update or create a KnowledgeChecks.
     * @example
     * // Update or create a KnowledgeChecks
     * const knowledgeChecks = await prisma.knowledgeChecks.upsert({
     *   create: {
     *     // ... data to create a KnowledgeChecks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KnowledgeChecks we want to update
     *   }
     * })
     */
    upsert<T extends KnowledgeChecksUpsertArgs>(args: SelectSubset<T, KnowledgeChecksUpsertArgs<ExtArgs>>): Prisma__KnowledgeChecksClient<$Result.GetResult<Prisma.$KnowledgeChecksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KnowledgeChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksCountArgs} args - Arguments to filter KnowledgeChecks to count.
     * @example
     * // Count the number of KnowledgeChecks
     * const count = await prisma.knowledgeChecks.count({
     *   where: {
     *     // ... the filter for the KnowledgeChecks we want to count
     *   }
     * })
    **/
    count<T extends KnowledgeChecksCountArgs>(
      args?: Subset<T, KnowledgeChecksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeChecksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KnowledgeChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KnowledgeChecksAggregateArgs>(args: Subset<T, KnowledgeChecksAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeChecksAggregateType<T>>

    /**
     * Group by KnowledgeChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeChecksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KnowledgeChecksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KnowledgeChecksGroupByArgs['orderBy'] }
        : { orderBy?: KnowledgeChecksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KnowledgeChecksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeChecksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KnowledgeChecks model
   */
  readonly fields: KnowledgeChecksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KnowledgeChecks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KnowledgeChecksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    learningPhase<T extends LearningPhaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LearningPhaseDefaultArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KnowledgeChecks model
   */
  interface KnowledgeChecksFieldRefs {
    readonly id: FieldRef<"KnowledgeChecks", 'String'>
    readonly phase_id: FieldRef<"KnowledgeChecks", 'String'>
    readonly question: FieldRef<"KnowledgeChecks", 'String'>
    readonly correct_answer: FieldRef<"KnowledgeChecks", 'String'>
    readonly explanation: FieldRef<"KnowledgeChecks", 'String'>
    readonly question_type: FieldRef<"KnowledgeChecks", 'Question_Type'>
  }
    

  // Custom InputTypes
  /**
   * KnowledgeChecks findUnique
   */
  export type KnowledgeChecksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeChecks to fetch.
     */
    where: KnowledgeChecksWhereUniqueInput
  }

  /**
   * KnowledgeChecks findUniqueOrThrow
   */
  export type KnowledgeChecksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeChecks to fetch.
     */
    where: KnowledgeChecksWhereUniqueInput
  }

  /**
   * KnowledgeChecks findFirst
   */
  export type KnowledgeChecksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeChecks to fetch.
     */
    where?: KnowledgeChecksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChecks to fetch.
     */
    orderBy?: KnowledgeChecksOrderByWithRelationInput | KnowledgeChecksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeChecks.
     */
    cursor?: KnowledgeChecksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChecks.
     */
    distinct?: KnowledgeChecksScalarFieldEnum | KnowledgeChecksScalarFieldEnum[]
  }

  /**
   * KnowledgeChecks findFirstOrThrow
   */
  export type KnowledgeChecksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeChecks to fetch.
     */
    where?: KnowledgeChecksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChecks to fetch.
     */
    orderBy?: KnowledgeChecksOrderByWithRelationInput | KnowledgeChecksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeChecks.
     */
    cursor?: KnowledgeChecksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeChecks.
     */
    distinct?: KnowledgeChecksScalarFieldEnum | KnowledgeChecksScalarFieldEnum[]
  }

  /**
   * KnowledgeChecks findMany
   */
  export type KnowledgeChecksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeChecks to fetch.
     */
    where?: KnowledgeChecksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeChecks to fetch.
     */
    orderBy?: KnowledgeChecksOrderByWithRelationInput | KnowledgeChecksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KnowledgeChecks.
     */
    cursor?: KnowledgeChecksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeChecks.
     */
    skip?: number
    distinct?: KnowledgeChecksScalarFieldEnum | KnowledgeChecksScalarFieldEnum[]
  }

  /**
   * KnowledgeChecks create
   */
  export type KnowledgeChecksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * The data needed to create a KnowledgeChecks.
     */
    data: XOR<KnowledgeChecksCreateInput, KnowledgeChecksUncheckedCreateInput>
  }

  /**
   * KnowledgeChecks createMany
   */
  export type KnowledgeChecksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KnowledgeChecks.
     */
    data: KnowledgeChecksCreateManyInput | KnowledgeChecksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KnowledgeChecks createManyAndReturn
   */
  export type KnowledgeChecksCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * The data used to create many KnowledgeChecks.
     */
    data: KnowledgeChecksCreateManyInput | KnowledgeChecksCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KnowledgeChecks update
   */
  export type KnowledgeChecksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * The data needed to update a KnowledgeChecks.
     */
    data: XOR<KnowledgeChecksUpdateInput, KnowledgeChecksUncheckedUpdateInput>
    /**
     * Choose, which KnowledgeChecks to update.
     */
    where: KnowledgeChecksWhereUniqueInput
  }

  /**
   * KnowledgeChecks updateMany
   */
  export type KnowledgeChecksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KnowledgeChecks.
     */
    data: XOR<KnowledgeChecksUpdateManyMutationInput, KnowledgeChecksUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeChecks to update
     */
    where?: KnowledgeChecksWhereInput
    /**
     * Limit how many KnowledgeChecks to update.
     */
    limit?: number
  }

  /**
   * KnowledgeChecks updateManyAndReturn
   */
  export type KnowledgeChecksUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * The data used to update KnowledgeChecks.
     */
    data: XOR<KnowledgeChecksUpdateManyMutationInput, KnowledgeChecksUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeChecks to update
     */
    where?: KnowledgeChecksWhereInput
    /**
     * Limit how many KnowledgeChecks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KnowledgeChecks upsert
   */
  export type KnowledgeChecksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * The filter to search for the KnowledgeChecks to update in case it exists.
     */
    where: KnowledgeChecksWhereUniqueInput
    /**
     * In case the KnowledgeChecks found by the `where` argument doesn't exist, create a new KnowledgeChecks with this data.
     */
    create: XOR<KnowledgeChecksCreateInput, KnowledgeChecksUncheckedCreateInput>
    /**
     * In case the KnowledgeChecks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KnowledgeChecksUpdateInput, KnowledgeChecksUncheckedUpdateInput>
  }

  /**
   * KnowledgeChecks delete
   */
  export type KnowledgeChecksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
    /**
     * Filter which KnowledgeChecks to delete.
     */
    where: KnowledgeChecksWhereUniqueInput
  }

  /**
   * KnowledgeChecks deleteMany
   */
  export type KnowledgeChecksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeChecks to delete
     */
    where?: KnowledgeChecksWhereInput
    /**
     * Limit how many KnowledgeChecks to delete.
     */
    limit?: number
  }

  /**
   * KnowledgeChecks without action
   */
  export type KnowledgeChecksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeChecks
     */
    select?: KnowledgeChecksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeChecks
     */
    omit?: KnowledgeChecksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeChecksInclude<ExtArgs> | null
  }


  /**
   * Model Resources
   */

  export type AggregateResources = {
    _count: ResourcesCountAggregateOutputType | null
    _avg: ResourcesAvgAggregateOutputType | null
    _sum: ResourcesSumAggregateOutputType | null
    _min: ResourcesMinAggregateOutputType | null
    _max: ResourcesMaxAggregateOutputType | null
  }

  export type ResourcesAvgAggregateOutputType = {
    duration_minutes: number | null
    quality_score: number | null
  }

  export type ResourcesSumAggregateOutputType = {
    duration_minutes: number | null
    quality_score: number | null
  }

  export type ResourcesMinAggregateOutputType = {
    id: string | null
    phase_id: string | null
    type: string | null
    title: string | null
    url: string | null
    duration_minutes: number | null
    provider: string | null
    quality_score: number | null
  }

  export type ResourcesMaxAggregateOutputType = {
    id: string | null
    phase_id: string | null
    type: string | null
    title: string | null
    url: string | null
    duration_minutes: number | null
    provider: string | null
    quality_score: number | null
  }

  export type ResourcesCountAggregateOutputType = {
    id: number
    phase_id: number
    type: number
    title: number
    url: number
    duration_minutes: number
    provider: number
    timestamps: number
    quality_score: number
    _all: number
  }


  export type ResourcesAvgAggregateInputType = {
    duration_minutes?: true
    quality_score?: true
  }

  export type ResourcesSumAggregateInputType = {
    duration_minutes?: true
    quality_score?: true
  }

  export type ResourcesMinAggregateInputType = {
    id?: true
    phase_id?: true
    type?: true
    title?: true
    url?: true
    duration_minutes?: true
    provider?: true
    quality_score?: true
  }

  export type ResourcesMaxAggregateInputType = {
    id?: true
    phase_id?: true
    type?: true
    title?: true
    url?: true
    duration_minutes?: true
    provider?: true
    quality_score?: true
  }

  export type ResourcesCountAggregateInputType = {
    id?: true
    phase_id?: true
    type?: true
    title?: true
    url?: true
    duration_minutes?: true
    provider?: true
    timestamps?: true
    quality_score?: true
    _all?: true
  }

  export type ResourcesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resources to aggregate.
     */
    where?: ResourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourcesOrderByWithRelationInput | ResourcesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resources
    **/
    _count?: true | ResourcesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResourcesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResourcesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResourcesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResourcesMaxAggregateInputType
  }

  export type GetResourcesAggregateType<T extends ResourcesAggregateArgs> = {
        [P in keyof T & keyof AggregateResources]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResources[P]>
      : GetScalarType<T[P], AggregateResources[P]>
  }




  export type ResourcesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResourcesWhereInput
    orderBy?: ResourcesOrderByWithAggregationInput | ResourcesOrderByWithAggregationInput[]
    by: ResourcesScalarFieldEnum[] | ResourcesScalarFieldEnum
    having?: ResourcesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResourcesCountAggregateInputType | true
    _avg?: ResourcesAvgAggregateInputType
    _sum?: ResourcesSumAggregateInputType
    _min?: ResourcesMinAggregateInputType
    _max?: ResourcesMaxAggregateInputType
  }

  export type ResourcesGroupByOutputType = {
    id: string
    phase_id: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps: JsonValue | null
    quality_score: number
    _count: ResourcesCountAggregateOutputType | null
    _avg: ResourcesAvgAggregateOutputType | null
    _sum: ResourcesSumAggregateOutputType | null
    _min: ResourcesMinAggregateOutputType | null
    _max: ResourcesMaxAggregateOutputType | null
  }

  type GetResourcesGroupByPayload<T extends ResourcesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResourcesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResourcesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResourcesGroupByOutputType[P]>
            : GetScalarType<T[P], ResourcesGroupByOutputType[P]>
        }
      >
    >


  export type ResourcesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase_id?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    duration_minutes?: boolean
    provider?: boolean
    timestamps?: boolean
    quality_score?: boolean
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
    userProgress?: boolean | Resources$userProgressArgs<ExtArgs>
    _count?: boolean | ResourcesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resources"]>

  export type ResourcesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase_id?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    duration_minutes?: boolean
    provider?: boolean
    timestamps?: boolean
    quality_score?: boolean
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resources"]>

  export type ResourcesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase_id?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    duration_minutes?: boolean
    provider?: boolean
    timestamps?: boolean
    quality_score?: boolean
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resources"]>

  export type ResourcesSelectScalar = {
    id?: boolean
    phase_id?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    duration_minutes?: boolean
    provider?: boolean
    timestamps?: boolean
    quality_score?: boolean
  }

  export type ResourcesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phase_id" | "type" | "title" | "url" | "duration_minutes" | "provider" | "timestamps" | "quality_score", ExtArgs["result"]["resources"]>
  export type ResourcesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
    userProgress?: boolean | Resources$userProgressArgs<ExtArgs>
    _count?: boolean | ResourcesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResourcesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }
  export type ResourcesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    learningPhase?: boolean | LearningPhaseDefaultArgs<ExtArgs>
  }

  export type $ResourcesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resources"
    objects: {
      learningPhase: Prisma.$LearningPhasePayload<ExtArgs>
      userProgress: Prisma.$ResourceProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phase_id: string
      type: string
      title: string
      url: string
      duration_minutes: number
      provider: string
      timestamps: Prisma.JsonValue | null
      quality_score: number
    }, ExtArgs["result"]["resources"]>
    composites: {}
  }

  type ResourcesGetPayload<S extends boolean | null | undefined | ResourcesDefaultArgs> = $Result.GetResult<Prisma.$ResourcesPayload, S>

  type ResourcesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResourcesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResourcesCountAggregateInputType | true
    }

  export interface ResourcesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resources'], meta: { name: 'Resources' } }
    /**
     * Find zero or one Resources that matches the filter.
     * @param {ResourcesFindUniqueArgs} args - Arguments to find a Resources
     * @example
     * // Get one Resources
     * const resources = await prisma.resources.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResourcesFindUniqueArgs>(args: SelectSubset<T, ResourcesFindUniqueArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resources that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResourcesFindUniqueOrThrowArgs} args - Arguments to find a Resources
     * @example
     * // Get one Resources
     * const resources = await prisma.resources.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResourcesFindUniqueOrThrowArgs>(args: SelectSubset<T, ResourcesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesFindFirstArgs} args - Arguments to find a Resources
     * @example
     * // Get one Resources
     * const resources = await prisma.resources.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResourcesFindFirstArgs>(args?: SelectSubset<T, ResourcesFindFirstArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resources that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesFindFirstOrThrowArgs} args - Arguments to find a Resources
     * @example
     * // Get one Resources
     * const resources = await prisma.resources.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResourcesFindFirstOrThrowArgs>(args?: SelectSubset<T, ResourcesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resources
     * const resources = await prisma.resources.findMany()
     * 
     * // Get first 10 Resources
     * const resources = await prisma.resources.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resourcesWithIdOnly = await prisma.resources.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResourcesFindManyArgs>(args?: SelectSubset<T, ResourcesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resources.
     * @param {ResourcesCreateArgs} args - Arguments to create a Resources.
     * @example
     * // Create one Resources
     * const Resources = await prisma.resources.create({
     *   data: {
     *     // ... data to create a Resources
     *   }
     * })
     * 
     */
    create<T extends ResourcesCreateArgs>(args: SelectSubset<T, ResourcesCreateArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resources.
     * @param {ResourcesCreateManyArgs} args - Arguments to create many Resources.
     * @example
     * // Create many Resources
     * const resources = await prisma.resources.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResourcesCreateManyArgs>(args?: SelectSubset<T, ResourcesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resources and returns the data saved in the database.
     * @param {ResourcesCreateManyAndReturnArgs} args - Arguments to create many Resources.
     * @example
     * // Create many Resources
     * const resources = await prisma.resources.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resources and only return the `id`
     * const resourcesWithIdOnly = await prisma.resources.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResourcesCreateManyAndReturnArgs>(args?: SelectSubset<T, ResourcesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resources.
     * @param {ResourcesDeleteArgs} args - Arguments to delete one Resources.
     * @example
     * // Delete one Resources
     * const Resources = await prisma.resources.delete({
     *   where: {
     *     // ... filter to delete one Resources
     *   }
     * })
     * 
     */
    delete<T extends ResourcesDeleteArgs>(args: SelectSubset<T, ResourcesDeleteArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resources.
     * @param {ResourcesUpdateArgs} args - Arguments to update one Resources.
     * @example
     * // Update one Resources
     * const resources = await prisma.resources.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResourcesUpdateArgs>(args: SelectSubset<T, ResourcesUpdateArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resources.
     * @param {ResourcesDeleteManyArgs} args - Arguments to filter Resources to delete.
     * @example
     * // Delete a few Resources
     * const { count } = await prisma.resources.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResourcesDeleteManyArgs>(args?: SelectSubset<T, ResourcesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resources
     * const resources = await prisma.resources.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResourcesUpdateManyArgs>(args: SelectSubset<T, ResourcesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resources and returns the data updated in the database.
     * @param {ResourcesUpdateManyAndReturnArgs} args - Arguments to update many Resources.
     * @example
     * // Update many Resources
     * const resources = await prisma.resources.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resources and only return the `id`
     * const resourcesWithIdOnly = await prisma.resources.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResourcesUpdateManyAndReturnArgs>(args: SelectSubset<T, ResourcesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resources.
     * @param {ResourcesUpsertArgs} args - Arguments to update or create a Resources.
     * @example
     * // Update or create a Resources
     * const resources = await prisma.resources.upsert({
     *   create: {
     *     // ... data to create a Resources
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resources we want to update
     *   }
     * })
     */
    upsert<T extends ResourcesUpsertArgs>(args: SelectSubset<T, ResourcesUpsertArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesCountArgs} args - Arguments to filter Resources to count.
     * @example
     * // Count the number of Resources
     * const count = await prisma.resources.count({
     *   where: {
     *     // ... the filter for the Resources we want to count
     *   }
     * })
    **/
    count<T extends ResourcesCountArgs>(
      args?: Subset<T, ResourcesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResourcesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResourcesAggregateArgs>(args: Subset<T, ResourcesAggregateArgs>): Prisma.PrismaPromise<GetResourcesAggregateType<T>>

    /**
     * Group by Resources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourcesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResourcesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResourcesGroupByArgs['orderBy'] }
        : { orderBy?: ResourcesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResourcesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResourcesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resources model
   */
  readonly fields: ResourcesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resources.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResourcesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    learningPhase<T extends LearningPhaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LearningPhaseDefaultArgs<ExtArgs>>): Prisma__LearningPhaseClient<$Result.GetResult<Prisma.$LearningPhasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    userProgress<T extends Resources$userProgressArgs<ExtArgs> = {}>(args?: Subset<T, Resources$userProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resources model
   */
  interface ResourcesFieldRefs {
    readonly id: FieldRef<"Resources", 'String'>
    readonly phase_id: FieldRef<"Resources", 'String'>
    readonly type: FieldRef<"Resources", 'String'>
    readonly title: FieldRef<"Resources", 'String'>
    readonly url: FieldRef<"Resources", 'String'>
    readonly duration_minutes: FieldRef<"Resources", 'Int'>
    readonly provider: FieldRef<"Resources", 'String'>
    readonly timestamps: FieldRef<"Resources", 'Json'>
    readonly quality_score: FieldRef<"Resources", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Resources findUnique
   */
  export type ResourcesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * Filter, which Resources to fetch.
     */
    where: ResourcesWhereUniqueInput
  }

  /**
   * Resources findUniqueOrThrow
   */
  export type ResourcesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * Filter, which Resources to fetch.
     */
    where: ResourcesWhereUniqueInput
  }

  /**
   * Resources findFirst
   */
  export type ResourcesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * Filter, which Resources to fetch.
     */
    where?: ResourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourcesOrderByWithRelationInput | ResourcesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resources.
     */
    cursor?: ResourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resources.
     */
    distinct?: ResourcesScalarFieldEnum | ResourcesScalarFieldEnum[]
  }

  /**
   * Resources findFirstOrThrow
   */
  export type ResourcesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * Filter, which Resources to fetch.
     */
    where?: ResourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourcesOrderByWithRelationInput | ResourcesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resources.
     */
    cursor?: ResourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resources.
     */
    distinct?: ResourcesScalarFieldEnum | ResourcesScalarFieldEnum[]
  }

  /**
   * Resources findMany
   */
  export type ResourcesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * Filter, which Resources to fetch.
     */
    where?: ResourcesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resources to fetch.
     */
    orderBy?: ResourcesOrderByWithRelationInput | ResourcesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resources.
     */
    cursor?: ResourcesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resources.
     */
    skip?: number
    distinct?: ResourcesScalarFieldEnum | ResourcesScalarFieldEnum[]
  }

  /**
   * Resources create
   */
  export type ResourcesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * The data needed to create a Resources.
     */
    data: XOR<ResourcesCreateInput, ResourcesUncheckedCreateInput>
  }

  /**
   * Resources createMany
   */
  export type ResourcesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resources.
     */
    data: ResourcesCreateManyInput | ResourcesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resources createManyAndReturn
   */
  export type ResourcesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * The data used to create many Resources.
     */
    data: ResourcesCreateManyInput | ResourcesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resources update
   */
  export type ResourcesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * The data needed to update a Resources.
     */
    data: XOR<ResourcesUpdateInput, ResourcesUncheckedUpdateInput>
    /**
     * Choose, which Resources to update.
     */
    where: ResourcesWhereUniqueInput
  }

  /**
   * Resources updateMany
   */
  export type ResourcesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resources.
     */
    data: XOR<ResourcesUpdateManyMutationInput, ResourcesUncheckedUpdateManyInput>
    /**
     * Filter which Resources to update
     */
    where?: ResourcesWhereInput
    /**
     * Limit how many Resources to update.
     */
    limit?: number
  }

  /**
   * Resources updateManyAndReturn
   */
  export type ResourcesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * The data used to update Resources.
     */
    data: XOR<ResourcesUpdateManyMutationInput, ResourcesUncheckedUpdateManyInput>
    /**
     * Filter which Resources to update
     */
    where?: ResourcesWhereInput
    /**
     * Limit how many Resources to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resources upsert
   */
  export type ResourcesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * The filter to search for the Resources to update in case it exists.
     */
    where: ResourcesWhereUniqueInput
    /**
     * In case the Resources found by the `where` argument doesn't exist, create a new Resources with this data.
     */
    create: XOR<ResourcesCreateInput, ResourcesUncheckedCreateInput>
    /**
     * In case the Resources was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResourcesUpdateInput, ResourcesUncheckedUpdateInput>
  }

  /**
   * Resources delete
   */
  export type ResourcesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
    /**
     * Filter which Resources to delete.
     */
    where: ResourcesWhereUniqueInput
  }

  /**
   * Resources deleteMany
   */
  export type ResourcesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resources to delete
     */
    where?: ResourcesWhereInput
    /**
     * Limit how many Resources to delete.
     */
    limit?: number
  }

  /**
   * Resources.userProgress
   */
  export type Resources$userProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    where?: ResourceProgressWhereInput
    orderBy?: ResourceProgressOrderByWithRelationInput | ResourceProgressOrderByWithRelationInput[]
    cursor?: ResourceProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResourceProgressScalarFieldEnum | ResourceProgressScalarFieldEnum[]
  }

  /**
   * Resources without action
   */
  export type ResourcesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resources
     */
    select?: ResourcesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resources
     */
    omit?: ResourcesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourcesInclude<ExtArgs> | null
  }


  /**
   * Model ResourceProgress
   */

  export type AggregateResourceProgress = {
    _count: ResourceProgressCountAggregateOutputType | null
    _min: ResourceProgressMinAggregateOutputType | null
    _max: ResourceProgressMaxAggregateOutputType | null
  }

  export type ResourceProgressMinAggregateOutputType = {
    id: string | null
    resource_id: string | null
    user_email: string | null
    project_id: string | null
    completed: boolean | null
    completed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ResourceProgressMaxAggregateOutputType = {
    id: string | null
    resource_id: string | null
    user_email: string | null
    project_id: string | null
    completed: boolean | null
    completed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ResourceProgressCountAggregateOutputType = {
    id: number
    resource_id: number
    user_email: number
    project_id: number
    completed: number
    completed_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ResourceProgressMinAggregateInputType = {
    id?: true
    resource_id?: true
    user_email?: true
    project_id?: true
    completed?: true
    completed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ResourceProgressMaxAggregateInputType = {
    id?: true
    resource_id?: true
    user_email?: true
    project_id?: true
    completed?: true
    completed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ResourceProgressCountAggregateInputType = {
    id?: true
    resource_id?: true
    user_email?: true
    project_id?: true
    completed?: true
    completed_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ResourceProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResourceProgress to aggregate.
     */
    where?: ResourceProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResourceProgresses to fetch.
     */
    orderBy?: ResourceProgressOrderByWithRelationInput | ResourceProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResourceProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResourceProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResourceProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResourceProgresses
    **/
    _count?: true | ResourceProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResourceProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResourceProgressMaxAggregateInputType
  }

  export type GetResourceProgressAggregateType<T extends ResourceProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateResourceProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResourceProgress[P]>
      : GetScalarType<T[P], AggregateResourceProgress[P]>
  }




  export type ResourceProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResourceProgressWhereInput
    orderBy?: ResourceProgressOrderByWithAggregationInput | ResourceProgressOrderByWithAggregationInput[]
    by: ResourceProgressScalarFieldEnum[] | ResourceProgressScalarFieldEnum
    having?: ResourceProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResourceProgressCountAggregateInputType | true
    _min?: ResourceProgressMinAggregateInputType
    _max?: ResourceProgressMaxAggregateInputType
  }

  export type ResourceProgressGroupByOutputType = {
    id: string
    resource_id: string
    user_email: string
    project_id: string
    completed: boolean
    completed_at: Date | null
    created_at: Date
    updated_at: Date
    _count: ResourceProgressCountAggregateOutputType | null
    _min: ResourceProgressMinAggregateOutputType | null
    _max: ResourceProgressMaxAggregateOutputType | null
  }

  type GetResourceProgressGroupByPayload<T extends ResourceProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResourceProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResourceProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResourceProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ResourceProgressGroupByOutputType[P]>
        }
      >
    >


  export type ResourceProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resource_id?: boolean
    user_email?: boolean
    project_id?: boolean
    completed?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    resource?: boolean | ResourcesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resourceProgress"]>

  export type ResourceProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resource_id?: boolean
    user_email?: boolean
    project_id?: boolean
    completed?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    resource?: boolean | ResourcesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resourceProgress"]>

  export type ResourceProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resource_id?: boolean
    user_email?: boolean
    project_id?: boolean
    completed?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    resource?: boolean | ResourcesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resourceProgress"]>

  export type ResourceProgressSelectScalar = {
    id?: boolean
    resource_id?: boolean
    user_email?: boolean
    project_id?: boolean
    completed?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ResourceProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "resource_id" | "user_email" | "project_id" | "completed" | "completed_at" | "created_at" | "updated_at", ExtArgs["result"]["resourceProgress"]>
  export type ResourceProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resource?: boolean | ResourcesDefaultArgs<ExtArgs>
  }
  export type ResourceProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resource?: boolean | ResourcesDefaultArgs<ExtArgs>
  }
  export type ResourceProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resource?: boolean | ResourcesDefaultArgs<ExtArgs>
  }

  export type $ResourceProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResourceProgress"
    objects: {
      resource: Prisma.$ResourcesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      resource_id: string
      user_email: string
      project_id: string
      completed: boolean
      completed_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["resourceProgress"]>
    composites: {}
  }

  type ResourceProgressGetPayload<S extends boolean | null | undefined | ResourceProgressDefaultArgs> = $Result.GetResult<Prisma.$ResourceProgressPayload, S>

  type ResourceProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResourceProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResourceProgressCountAggregateInputType | true
    }

  export interface ResourceProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResourceProgress'], meta: { name: 'ResourceProgress' } }
    /**
     * Find zero or one ResourceProgress that matches the filter.
     * @param {ResourceProgressFindUniqueArgs} args - Arguments to find a ResourceProgress
     * @example
     * // Get one ResourceProgress
     * const resourceProgress = await prisma.resourceProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResourceProgressFindUniqueArgs>(args: SelectSubset<T, ResourceProgressFindUniqueArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ResourceProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResourceProgressFindUniqueOrThrowArgs} args - Arguments to find a ResourceProgress
     * @example
     * // Get one ResourceProgress
     * const resourceProgress = await prisma.resourceProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResourceProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ResourceProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResourceProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressFindFirstArgs} args - Arguments to find a ResourceProgress
     * @example
     * // Get one ResourceProgress
     * const resourceProgress = await prisma.resourceProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResourceProgressFindFirstArgs>(args?: SelectSubset<T, ResourceProgressFindFirstArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResourceProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressFindFirstOrThrowArgs} args - Arguments to find a ResourceProgress
     * @example
     * // Get one ResourceProgress
     * const resourceProgress = await prisma.resourceProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResourceProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ResourceProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ResourceProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResourceProgresses
     * const resourceProgresses = await prisma.resourceProgress.findMany()
     * 
     * // Get first 10 ResourceProgresses
     * const resourceProgresses = await prisma.resourceProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resourceProgressWithIdOnly = await prisma.resourceProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResourceProgressFindManyArgs>(args?: SelectSubset<T, ResourceProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ResourceProgress.
     * @param {ResourceProgressCreateArgs} args - Arguments to create a ResourceProgress.
     * @example
     * // Create one ResourceProgress
     * const ResourceProgress = await prisma.resourceProgress.create({
     *   data: {
     *     // ... data to create a ResourceProgress
     *   }
     * })
     * 
     */
    create<T extends ResourceProgressCreateArgs>(args: SelectSubset<T, ResourceProgressCreateArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ResourceProgresses.
     * @param {ResourceProgressCreateManyArgs} args - Arguments to create many ResourceProgresses.
     * @example
     * // Create many ResourceProgresses
     * const resourceProgress = await prisma.resourceProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResourceProgressCreateManyArgs>(args?: SelectSubset<T, ResourceProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResourceProgresses and returns the data saved in the database.
     * @param {ResourceProgressCreateManyAndReturnArgs} args - Arguments to create many ResourceProgresses.
     * @example
     * // Create many ResourceProgresses
     * const resourceProgress = await prisma.resourceProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResourceProgresses and only return the `id`
     * const resourceProgressWithIdOnly = await prisma.resourceProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResourceProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ResourceProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ResourceProgress.
     * @param {ResourceProgressDeleteArgs} args - Arguments to delete one ResourceProgress.
     * @example
     * // Delete one ResourceProgress
     * const ResourceProgress = await prisma.resourceProgress.delete({
     *   where: {
     *     // ... filter to delete one ResourceProgress
     *   }
     * })
     * 
     */
    delete<T extends ResourceProgressDeleteArgs>(args: SelectSubset<T, ResourceProgressDeleteArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ResourceProgress.
     * @param {ResourceProgressUpdateArgs} args - Arguments to update one ResourceProgress.
     * @example
     * // Update one ResourceProgress
     * const resourceProgress = await prisma.resourceProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResourceProgressUpdateArgs>(args: SelectSubset<T, ResourceProgressUpdateArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ResourceProgresses.
     * @param {ResourceProgressDeleteManyArgs} args - Arguments to filter ResourceProgresses to delete.
     * @example
     * // Delete a few ResourceProgresses
     * const { count } = await prisma.resourceProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResourceProgressDeleteManyArgs>(args?: SelectSubset<T, ResourceProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResourceProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResourceProgresses
     * const resourceProgress = await prisma.resourceProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResourceProgressUpdateManyArgs>(args: SelectSubset<T, ResourceProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResourceProgresses and returns the data updated in the database.
     * @param {ResourceProgressUpdateManyAndReturnArgs} args - Arguments to update many ResourceProgresses.
     * @example
     * // Update many ResourceProgresses
     * const resourceProgress = await prisma.resourceProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ResourceProgresses and only return the `id`
     * const resourceProgressWithIdOnly = await prisma.resourceProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResourceProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, ResourceProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ResourceProgress.
     * @param {ResourceProgressUpsertArgs} args - Arguments to update or create a ResourceProgress.
     * @example
     * // Update or create a ResourceProgress
     * const resourceProgress = await prisma.resourceProgress.upsert({
     *   create: {
     *     // ... data to create a ResourceProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResourceProgress we want to update
     *   }
     * })
     */
    upsert<T extends ResourceProgressUpsertArgs>(args: SelectSubset<T, ResourceProgressUpsertArgs<ExtArgs>>): Prisma__ResourceProgressClient<$Result.GetResult<Prisma.$ResourceProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ResourceProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressCountArgs} args - Arguments to filter ResourceProgresses to count.
     * @example
     * // Count the number of ResourceProgresses
     * const count = await prisma.resourceProgress.count({
     *   where: {
     *     // ... the filter for the ResourceProgresses we want to count
     *   }
     * })
    **/
    count<T extends ResourceProgressCountArgs>(
      args?: Subset<T, ResourceProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResourceProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResourceProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResourceProgressAggregateArgs>(args: Subset<T, ResourceProgressAggregateArgs>): Prisma.PrismaPromise<GetResourceProgressAggregateType<T>>

    /**
     * Group by ResourceProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResourceProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResourceProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResourceProgressGroupByArgs['orderBy'] }
        : { orderBy?: ResourceProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResourceProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResourceProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResourceProgress model
   */
  readonly fields: ResourceProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResourceProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResourceProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resource<T extends ResourcesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ResourcesDefaultArgs<ExtArgs>>): Prisma__ResourcesClient<$Result.GetResult<Prisma.$ResourcesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ResourceProgress model
   */
  interface ResourceProgressFieldRefs {
    readonly id: FieldRef<"ResourceProgress", 'String'>
    readonly resource_id: FieldRef<"ResourceProgress", 'String'>
    readonly user_email: FieldRef<"ResourceProgress", 'String'>
    readonly project_id: FieldRef<"ResourceProgress", 'String'>
    readonly completed: FieldRef<"ResourceProgress", 'Boolean'>
    readonly completed_at: FieldRef<"ResourceProgress", 'DateTime'>
    readonly created_at: FieldRef<"ResourceProgress", 'DateTime'>
    readonly updated_at: FieldRef<"ResourceProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ResourceProgress findUnique
   */
  export type ResourceProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * Filter, which ResourceProgress to fetch.
     */
    where: ResourceProgressWhereUniqueInput
  }

  /**
   * ResourceProgress findUniqueOrThrow
   */
  export type ResourceProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * Filter, which ResourceProgress to fetch.
     */
    where: ResourceProgressWhereUniqueInput
  }

  /**
   * ResourceProgress findFirst
   */
  export type ResourceProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * Filter, which ResourceProgress to fetch.
     */
    where?: ResourceProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResourceProgresses to fetch.
     */
    orderBy?: ResourceProgressOrderByWithRelationInput | ResourceProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResourceProgresses.
     */
    cursor?: ResourceProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResourceProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResourceProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResourceProgresses.
     */
    distinct?: ResourceProgressScalarFieldEnum | ResourceProgressScalarFieldEnum[]
  }

  /**
   * ResourceProgress findFirstOrThrow
   */
  export type ResourceProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * Filter, which ResourceProgress to fetch.
     */
    where?: ResourceProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResourceProgresses to fetch.
     */
    orderBy?: ResourceProgressOrderByWithRelationInput | ResourceProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResourceProgresses.
     */
    cursor?: ResourceProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResourceProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResourceProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResourceProgresses.
     */
    distinct?: ResourceProgressScalarFieldEnum | ResourceProgressScalarFieldEnum[]
  }

  /**
   * ResourceProgress findMany
   */
  export type ResourceProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * Filter, which ResourceProgresses to fetch.
     */
    where?: ResourceProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResourceProgresses to fetch.
     */
    orderBy?: ResourceProgressOrderByWithRelationInput | ResourceProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResourceProgresses.
     */
    cursor?: ResourceProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResourceProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResourceProgresses.
     */
    skip?: number
    distinct?: ResourceProgressScalarFieldEnum | ResourceProgressScalarFieldEnum[]
  }

  /**
   * ResourceProgress create
   */
  export type ResourceProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a ResourceProgress.
     */
    data: XOR<ResourceProgressCreateInput, ResourceProgressUncheckedCreateInput>
  }

  /**
   * ResourceProgress createMany
   */
  export type ResourceProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResourceProgresses.
     */
    data: ResourceProgressCreateManyInput | ResourceProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResourceProgress createManyAndReturn
   */
  export type ResourceProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * The data used to create many ResourceProgresses.
     */
    data: ResourceProgressCreateManyInput | ResourceProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResourceProgress update
   */
  export type ResourceProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a ResourceProgress.
     */
    data: XOR<ResourceProgressUpdateInput, ResourceProgressUncheckedUpdateInput>
    /**
     * Choose, which ResourceProgress to update.
     */
    where: ResourceProgressWhereUniqueInput
  }

  /**
   * ResourceProgress updateMany
   */
  export type ResourceProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResourceProgresses.
     */
    data: XOR<ResourceProgressUpdateManyMutationInput, ResourceProgressUncheckedUpdateManyInput>
    /**
     * Filter which ResourceProgresses to update
     */
    where?: ResourceProgressWhereInput
    /**
     * Limit how many ResourceProgresses to update.
     */
    limit?: number
  }

  /**
   * ResourceProgress updateManyAndReturn
   */
  export type ResourceProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * The data used to update ResourceProgresses.
     */
    data: XOR<ResourceProgressUpdateManyMutationInput, ResourceProgressUncheckedUpdateManyInput>
    /**
     * Filter which ResourceProgresses to update
     */
    where?: ResourceProgressWhereInput
    /**
     * Limit how many ResourceProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResourceProgress upsert
   */
  export type ResourceProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the ResourceProgress to update in case it exists.
     */
    where: ResourceProgressWhereUniqueInput
    /**
     * In case the ResourceProgress found by the `where` argument doesn't exist, create a new ResourceProgress with this data.
     */
    create: XOR<ResourceProgressCreateInput, ResourceProgressUncheckedCreateInput>
    /**
     * In case the ResourceProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResourceProgressUpdateInput, ResourceProgressUncheckedUpdateInput>
  }

  /**
   * ResourceProgress delete
   */
  export type ResourceProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
    /**
     * Filter which ResourceProgress to delete.
     */
    where: ResourceProgressWhereUniqueInput
  }

  /**
   * ResourceProgress deleteMany
   */
  export type ResourceProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResourceProgresses to delete
     */
    where?: ResourceProgressWhereInput
    /**
     * Limit how many ResourceProgresses to delete.
     */
    limit?: number
  }

  /**
   * ResourceProgress without action
   */
  export type ResourceProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResourceProgress
     */
    select?: ResourceProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResourceProgress
     */
    omit?: ResourceProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResourceProgressInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    uid: 'uid',
    email: 'email',
    skillLevel: 'skillLevel',
    learningModes: 'learningModes',
    hoursPerWeek: 'hoursPerWeek',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProjectsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    tech_stack: 'tech_stack',
    skill_level: 'skill_level',
    goal: 'goal',
    demo_url: 'demo_url',
    estimated_minutes: 'estimated_minutes',
    initial_files: 'initial_files',
    createdAt: 'createdAt'
  };

  export type ProjectsScalarFieldEnum = (typeof ProjectsScalarFieldEnum)[keyof typeof ProjectsScalarFieldEnum]


  export const DeliverableScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    text: 'text',
    order: 'order'
  };

  export type DeliverableScalarFieldEnum = (typeof DeliverableScalarFieldEnum)[keyof typeof DeliverableScalarFieldEnum]


  export const EntranceQuestionScalarFieldEnum: {
    id: 'id',
    question: 'question',
    options: 'options',
    correct_option: 'correct_option',
    description: 'description',
    explanation: 'explanation',
    difficulty: 'difficulty',
    topic: 'topic',
    createdAt: 'createdAt'
  };

  export type EntranceQuestionScalarFieldEnum = (typeof EntranceQuestionScalarFieldEnum)[keyof typeof EntranceQuestionScalarFieldEnum]


  export const EntranceTestAttemptScalarFieldEnum: {
    id: 'id',
    user_email: 'user_email',
    status: 'status',
    round: 'round',
    answers: 'answers',
    result_level: 'result_level',
    started_at: 'started_at',
    completed_at: 'completed_at'
  };

  export type EntranceTestAttemptScalarFieldEnum = (typeof EntranceTestAttemptScalarFieldEnum)[keyof typeof EntranceTestAttemptScalarFieldEnum]


  export const ProjectFileScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    user_email: 'user_email',
    file_path: 'file_path',
    content: 'content',
    is_directory: 'is_directory',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum]


  export const UserProjectsScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    user_email: 'user_email',
    status: 'status',
    current_phase: 'current_phase',
    started_at: 'started_at',
    completed_at: 'completed_at',
    archived: 'archived'
  };

  export type UserProjectsScalarFieldEnum = (typeof UserProjectsScalarFieldEnum)[keyof typeof UserProjectsScalarFieldEnum]


  export const LearningPhaseScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    title: 'title',
    description: 'description',
    long_description: 'long_description',
    concepts: 'concepts',
    goal: 'goal',
    phase_number: 'phase_number',
    phase_status: 'phase_status',
    estimated_minutes: 'estimated_minutes',
    createdAt: 'createdAt'
  };

  export type LearningPhaseScalarFieldEnum = (typeof LearningPhaseScalarFieldEnum)[keyof typeof LearningPhaseScalarFieldEnum]


  export const KnowledgeChecksScalarFieldEnum: {
    id: 'id',
    phase_id: 'phase_id',
    question: 'question',
    correct_answer: 'correct_answer',
    explanation: 'explanation',
    question_type: 'question_type'
  };

  export type KnowledgeChecksScalarFieldEnum = (typeof KnowledgeChecksScalarFieldEnum)[keyof typeof KnowledgeChecksScalarFieldEnum]


  export const ResourcesScalarFieldEnum: {
    id: 'id',
    phase_id: 'phase_id',
    type: 'type',
    title: 'title',
    url: 'url',
    duration_minutes: 'duration_minutes',
    provider: 'provider',
    timestamps: 'timestamps',
    quality_score: 'quality_score'
  };

  export type ResourcesScalarFieldEnum = (typeof ResourcesScalarFieldEnum)[keyof typeof ResourcesScalarFieldEnum]


  export const ResourceProgressScalarFieldEnum: {
    id: 'id',
    resource_id: 'resource_id',
    user_email: 'user_email',
    project_id: 'project_id',
    completed: 'completed',
    completed_at: 'completed_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ResourceProgressScalarFieldEnum = (typeof ResourceProgressScalarFieldEnum)[keyof typeof ResourceProgressScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Skill_Level'
   */
  export type EnumSkill_LevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Skill_Level'>
    


  /**
   * Reference to a field of type 'Skill_Level[]'
   */
  export type ListEnumSkill_LevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Skill_Level[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Difficulty'
   */
  export type EnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty'>
    


  /**
   * Reference to a field of type 'Difficulty[]'
   */
  export type ListEnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty[]'>
    


  /**
   * Reference to a field of type 'TestStatus'
   */
  export type EnumTestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestStatus'>
    


  /**
   * Reference to a field of type 'TestStatus[]'
   */
  export type ListEnumTestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Status'
   */
  export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


  /**
   * Reference to a field of type 'Status[]'
   */
  export type ListEnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status[]'>
    


  /**
   * Reference to a field of type 'PhaseStatus'
   */
  export type EnumPhaseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhaseStatus'>
    


  /**
   * Reference to a field of type 'PhaseStatus[]'
   */
  export type ListEnumPhaseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhaseStatus[]'>
    


  /**
   * Reference to a field of type 'Question_Type'
   */
  export type EnumQuestion_TypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Question_Type'>
    


  /**
   * Reference to a field of type 'Question_Type[]'
   */
  export type ListEnumQuestion_TypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Question_Type[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    uid?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    skillLevel?: EnumSkill_LevelNullableFilter<"User"> | $Enums.Skill_Level | null
    learningModes?: StringNullableListFilter<"User">
    hoursPerWeek?: IntNullableFilter<"User"> | number | null
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    userProjects?: UserProjectsListRelationFilter
    entranceTestAttempt?: XOR<EntranceTestAttemptNullableScalarRelationFilter, EntranceTestAttemptWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    uid?: SortOrder
    email?: SortOrder
    skillLevel?: SortOrderInput | SortOrder
    learningModes?: SortOrder
    hoursPerWeek?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    userProjects?: UserProjectsOrderByRelationAggregateInput
    entranceTestAttempt?: EntranceTestAttemptOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    uid?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    skillLevel?: EnumSkill_LevelNullableFilter<"User"> | $Enums.Skill_Level | null
    learningModes?: StringNullableListFilter<"User">
    hoursPerWeek?: IntNullableFilter<"User"> | number | null
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    userProjects?: UserProjectsListRelationFilter
    entranceTestAttempt?: XOR<EntranceTestAttemptNullableScalarRelationFilter, EntranceTestAttemptWhereInput> | null
  }, "uid" | "email">

  export type UserOrderByWithAggregationInput = {
    uid?: SortOrder
    email?: SortOrder
    skillLevel?: SortOrderInput | SortOrder
    learningModes?: SortOrder
    hoursPerWeek?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    uid?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    skillLevel?: EnumSkill_LevelNullableWithAggregatesFilter<"User"> | $Enums.Skill_Level | null
    learningModes?: StringNullableListFilter<"User">
    hoursPerWeek?: IntNullableWithAggregatesFilter<"User"> | number | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProjectsWhereInput = {
    AND?: ProjectsWhereInput | ProjectsWhereInput[]
    OR?: ProjectsWhereInput[]
    NOT?: ProjectsWhereInput | ProjectsWhereInput[]
    id?: StringFilter<"Projects"> | string
    name?: StringFilter<"Projects"> | string
    tech_stack?: StringNullableListFilter<"Projects">
    skill_level?: EnumSkill_LevelFilter<"Projects"> | $Enums.Skill_Level
    goal?: StringFilter<"Projects"> | string
    demo_url?: StringNullableFilter<"Projects"> | string | null
    estimated_minutes?: IntFilter<"Projects"> | number
    initial_files?: JsonNullableFilter<"Projects">
    createdAt?: DateTimeFilter<"Projects"> | Date | string
    learningPhases?: LearningPhaseListRelationFilter
    userProjects?: UserProjectsListRelationFilter
    deliverables?: DeliverableListRelationFilter
  }

  export type ProjectsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    tech_stack?: SortOrder
    skill_level?: SortOrder
    goal?: SortOrder
    demo_url?: SortOrderInput | SortOrder
    estimated_minutes?: SortOrder
    initial_files?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    learningPhases?: LearningPhaseOrderByRelationAggregateInput
    userProjects?: UserProjectsOrderByRelationAggregateInput
    deliverables?: DeliverableOrderByRelationAggregateInput
  }

  export type ProjectsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectsWhereInput | ProjectsWhereInput[]
    OR?: ProjectsWhereInput[]
    NOT?: ProjectsWhereInput | ProjectsWhereInput[]
    name?: StringFilter<"Projects"> | string
    tech_stack?: StringNullableListFilter<"Projects">
    skill_level?: EnumSkill_LevelFilter<"Projects"> | $Enums.Skill_Level
    goal?: StringFilter<"Projects"> | string
    demo_url?: StringNullableFilter<"Projects"> | string | null
    estimated_minutes?: IntFilter<"Projects"> | number
    initial_files?: JsonNullableFilter<"Projects">
    createdAt?: DateTimeFilter<"Projects"> | Date | string
    learningPhases?: LearningPhaseListRelationFilter
    userProjects?: UserProjectsListRelationFilter
    deliverables?: DeliverableListRelationFilter
  }, "id">

  export type ProjectsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    tech_stack?: SortOrder
    skill_level?: SortOrder
    goal?: SortOrder
    demo_url?: SortOrderInput | SortOrder
    estimated_minutes?: SortOrder
    initial_files?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ProjectsCountOrderByAggregateInput
    _avg?: ProjectsAvgOrderByAggregateInput
    _max?: ProjectsMaxOrderByAggregateInput
    _min?: ProjectsMinOrderByAggregateInput
    _sum?: ProjectsSumOrderByAggregateInput
  }

  export type ProjectsScalarWhereWithAggregatesInput = {
    AND?: ProjectsScalarWhereWithAggregatesInput | ProjectsScalarWhereWithAggregatesInput[]
    OR?: ProjectsScalarWhereWithAggregatesInput[]
    NOT?: ProjectsScalarWhereWithAggregatesInput | ProjectsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Projects"> | string
    name?: StringWithAggregatesFilter<"Projects"> | string
    tech_stack?: StringNullableListFilter<"Projects">
    skill_level?: EnumSkill_LevelWithAggregatesFilter<"Projects"> | $Enums.Skill_Level
    goal?: StringWithAggregatesFilter<"Projects"> | string
    demo_url?: StringNullableWithAggregatesFilter<"Projects"> | string | null
    estimated_minutes?: IntWithAggregatesFilter<"Projects"> | number
    initial_files?: JsonNullableWithAggregatesFilter<"Projects">
    createdAt?: DateTimeWithAggregatesFilter<"Projects"> | Date | string
  }

  export type DeliverableWhereInput = {
    AND?: DeliverableWhereInput | DeliverableWhereInput[]
    OR?: DeliverableWhereInput[]
    NOT?: DeliverableWhereInput | DeliverableWhereInput[]
    id?: StringFilter<"Deliverable"> | string
    project_id?: StringFilter<"Deliverable"> | string
    text?: StringFilter<"Deliverable"> | string
    order?: IntFilter<"Deliverable"> | number
    project?: XOR<ProjectsScalarRelationFilter, ProjectsWhereInput>
  }

  export type DeliverableOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    text?: SortOrder
    order?: SortOrder
    project?: ProjectsOrderByWithRelationInput
  }

  export type DeliverableWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeliverableWhereInput | DeliverableWhereInput[]
    OR?: DeliverableWhereInput[]
    NOT?: DeliverableWhereInput | DeliverableWhereInput[]
    project_id?: StringFilter<"Deliverable"> | string
    text?: StringFilter<"Deliverable"> | string
    order?: IntFilter<"Deliverable"> | number
    project?: XOR<ProjectsScalarRelationFilter, ProjectsWhereInput>
  }, "id">

  export type DeliverableOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    text?: SortOrder
    order?: SortOrder
    _count?: DeliverableCountOrderByAggregateInput
    _avg?: DeliverableAvgOrderByAggregateInput
    _max?: DeliverableMaxOrderByAggregateInput
    _min?: DeliverableMinOrderByAggregateInput
    _sum?: DeliverableSumOrderByAggregateInput
  }

  export type DeliverableScalarWhereWithAggregatesInput = {
    AND?: DeliverableScalarWhereWithAggregatesInput | DeliverableScalarWhereWithAggregatesInput[]
    OR?: DeliverableScalarWhereWithAggregatesInput[]
    NOT?: DeliverableScalarWhereWithAggregatesInput | DeliverableScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Deliverable"> | string
    project_id?: StringWithAggregatesFilter<"Deliverable"> | string
    text?: StringWithAggregatesFilter<"Deliverable"> | string
    order?: IntWithAggregatesFilter<"Deliverable"> | number
  }

  export type EntranceQuestionWhereInput = {
    AND?: EntranceQuestionWhereInput | EntranceQuestionWhereInput[]
    OR?: EntranceQuestionWhereInput[]
    NOT?: EntranceQuestionWhereInput | EntranceQuestionWhereInput[]
    id?: StringFilter<"EntranceQuestion"> | string
    question?: StringFilter<"EntranceQuestion"> | string
    options?: StringNullableListFilter<"EntranceQuestion">
    correct_option?: IntFilter<"EntranceQuestion"> | number
    description?: StringFilter<"EntranceQuestion"> | string
    explanation?: StringFilter<"EntranceQuestion"> | string
    difficulty?: EnumDifficultyFilter<"EntranceQuestion"> | $Enums.Difficulty
    topic?: StringFilter<"EntranceQuestion"> | string
    createdAt?: DateTimeFilter<"EntranceQuestion"> | Date | string
  }

  export type EntranceQuestionOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correct_option?: SortOrder
    description?: SortOrder
    explanation?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    createdAt?: SortOrder
  }

  export type EntranceQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EntranceQuestionWhereInput | EntranceQuestionWhereInput[]
    OR?: EntranceQuestionWhereInput[]
    NOT?: EntranceQuestionWhereInput | EntranceQuestionWhereInput[]
    question?: StringFilter<"EntranceQuestion"> | string
    options?: StringNullableListFilter<"EntranceQuestion">
    correct_option?: IntFilter<"EntranceQuestion"> | number
    description?: StringFilter<"EntranceQuestion"> | string
    explanation?: StringFilter<"EntranceQuestion"> | string
    difficulty?: EnumDifficultyFilter<"EntranceQuestion"> | $Enums.Difficulty
    topic?: StringFilter<"EntranceQuestion"> | string
    createdAt?: DateTimeFilter<"EntranceQuestion"> | Date | string
  }, "id">

  export type EntranceQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correct_option?: SortOrder
    description?: SortOrder
    explanation?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    createdAt?: SortOrder
    _count?: EntranceQuestionCountOrderByAggregateInput
    _avg?: EntranceQuestionAvgOrderByAggregateInput
    _max?: EntranceQuestionMaxOrderByAggregateInput
    _min?: EntranceQuestionMinOrderByAggregateInput
    _sum?: EntranceQuestionSumOrderByAggregateInput
  }

  export type EntranceQuestionScalarWhereWithAggregatesInput = {
    AND?: EntranceQuestionScalarWhereWithAggregatesInput | EntranceQuestionScalarWhereWithAggregatesInput[]
    OR?: EntranceQuestionScalarWhereWithAggregatesInput[]
    NOT?: EntranceQuestionScalarWhereWithAggregatesInput | EntranceQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EntranceQuestion"> | string
    question?: StringWithAggregatesFilter<"EntranceQuestion"> | string
    options?: StringNullableListFilter<"EntranceQuestion">
    correct_option?: IntWithAggregatesFilter<"EntranceQuestion"> | number
    description?: StringWithAggregatesFilter<"EntranceQuestion"> | string
    explanation?: StringWithAggregatesFilter<"EntranceQuestion"> | string
    difficulty?: EnumDifficultyWithAggregatesFilter<"EntranceQuestion"> | $Enums.Difficulty
    topic?: StringWithAggregatesFilter<"EntranceQuestion"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EntranceQuestion"> | Date | string
  }

  export type EntranceTestAttemptWhereInput = {
    AND?: EntranceTestAttemptWhereInput | EntranceTestAttemptWhereInput[]
    OR?: EntranceTestAttemptWhereInput[]
    NOT?: EntranceTestAttemptWhereInput | EntranceTestAttemptWhereInput[]
    id?: StringFilter<"EntranceTestAttempt"> | string
    user_email?: StringFilter<"EntranceTestAttempt"> | string
    status?: EnumTestStatusFilter<"EntranceTestAttempt"> | $Enums.TestStatus
    round?: IntFilter<"EntranceTestAttempt"> | number
    answers?: JsonFilter<"EntranceTestAttempt">
    result_level?: EnumSkill_LevelNullableFilter<"EntranceTestAttempt"> | $Enums.Skill_Level | null
    started_at?: DateTimeFilter<"EntranceTestAttempt"> | Date | string
    completed_at?: DateTimeNullableFilter<"EntranceTestAttempt"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type EntranceTestAttemptOrderByWithRelationInput = {
    id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    round?: SortOrder
    answers?: SortOrder
    result_level?: SortOrderInput | SortOrder
    started_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type EntranceTestAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_email?: string
    AND?: EntranceTestAttemptWhereInput | EntranceTestAttemptWhereInput[]
    OR?: EntranceTestAttemptWhereInput[]
    NOT?: EntranceTestAttemptWhereInput | EntranceTestAttemptWhereInput[]
    status?: EnumTestStatusFilter<"EntranceTestAttempt"> | $Enums.TestStatus
    round?: IntFilter<"EntranceTestAttempt"> | number
    answers?: JsonFilter<"EntranceTestAttempt">
    result_level?: EnumSkill_LevelNullableFilter<"EntranceTestAttempt"> | $Enums.Skill_Level | null
    started_at?: DateTimeFilter<"EntranceTestAttempt"> | Date | string
    completed_at?: DateTimeNullableFilter<"EntranceTestAttempt"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "user_email">

  export type EntranceTestAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    round?: SortOrder
    answers?: SortOrder
    result_level?: SortOrderInput | SortOrder
    started_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    _count?: EntranceTestAttemptCountOrderByAggregateInput
    _avg?: EntranceTestAttemptAvgOrderByAggregateInput
    _max?: EntranceTestAttemptMaxOrderByAggregateInput
    _min?: EntranceTestAttemptMinOrderByAggregateInput
    _sum?: EntranceTestAttemptSumOrderByAggregateInput
  }

  export type EntranceTestAttemptScalarWhereWithAggregatesInput = {
    AND?: EntranceTestAttemptScalarWhereWithAggregatesInput | EntranceTestAttemptScalarWhereWithAggregatesInput[]
    OR?: EntranceTestAttemptScalarWhereWithAggregatesInput[]
    NOT?: EntranceTestAttemptScalarWhereWithAggregatesInput | EntranceTestAttemptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EntranceTestAttempt"> | string
    user_email?: StringWithAggregatesFilter<"EntranceTestAttempt"> | string
    status?: EnumTestStatusWithAggregatesFilter<"EntranceTestAttempt"> | $Enums.TestStatus
    round?: IntWithAggregatesFilter<"EntranceTestAttempt"> | number
    answers?: JsonWithAggregatesFilter<"EntranceTestAttempt">
    result_level?: EnumSkill_LevelNullableWithAggregatesFilter<"EntranceTestAttempt"> | $Enums.Skill_Level | null
    started_at?: DateTimeWithAggregatesFilter<"EntranceTestAttempt"> | Date | string
    completed_at?: DateTimeNullableWithAggregatesFilter<"EntranceTestAttempt"> | Date | string | null
  }

  export type ProjectFileWhereInput = {
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    project_id?: StringFilter<"ProjectFile"> | string
    user_email?: StringFilter<"ProjectFile"> | string
    file_path?: StringFilter<"ProjectFile"> | string
    content?: StringFilter<"ProjectFile"> | string
    is_directory?: BoolFilter<"ProjectFile"> | boolean
    created_at?: DateTimeFilter<"ProjectFile"> | Date | string
    updated_at?: DateTimeFilter<"ProjectFile"> | Date | string
    userProject?: XOR<UserProjectsScalarRelationFilter, UserProjectsWhereInput>
  }

  export type ProjectFileOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    file_path?: SortOrder
    content?: SortOrder
    is_directory?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    userProject?: UserProjectsOrderByWithRelationInput
  }

  export type ProjectFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    project_id_user_email_file_path?: ProjectFileProject_idUser_emailFile_pathCompoundUniqueInput
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    project_id?: StringFilter<"ProjectFile"> | string
    user_email?: StringFilter<"ProjectFile"> | string
    file_path?: StringFilter<"ProjectFile"> | string
    content?: StringFilter<"ProjectFile"> | string
    is_directory?: BoolFilter<"ProjectFile"> | boolean
    created_at?: DateTimeFilter<"ProjectFile"> | Date | string
    updated_at?: DateTimeFilter<"ProjectFile"> | Date | string
    userProject?: XOR<UserProjectsScalarRelationFilter, UserProjectsWhereInput>
  }, "id" | "project_id_user_email_file_path">

  export type ProjectFileOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    file_path?: SortOrder
    content?: SortOrder
    is_directory?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ProjectFileCountOrderByAggregateInput
    _max?: ProjectFileMaxOrderByAggregateInput
    _min?: ProjectFileMinOrderByAggregateInput
  }

  export type ProjectFileScalarWhereWithAggregatesInput = {
    AND?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    OR?: ProjectFileScalarWhereWithAggregatesInput[]
    NOT?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFile"> | string
    project_id?: StringWithAggregatesFilter<"ProjectFile"> | string
    user_email?: StringWithAggregatesFilter<"ProjectFile"> | string
    file_path?: StringWithAggregatesFilter<"ProjectFile"> | string
    content?: StringWithAggregatesFilter<"ProjectFile"> | string
    is_directory?: BoolWithAggregatesFilter<"ProjectFile"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
  }

  export type UserProjectsWhereInput = {
    AND?: UserProjectsWhereInput | UserProjectsWhereInput[]
    OR?: UserProjectsWhereInput[]
    NOT?: UserProjectsWhereInput | UserProjectsWhereInput[]
    id?: StringFilter<"UserProjects"> | string
    project_id?: StringFilter<"UserProjects"> | string
    user_email?: StringFilter<"UserProjects"> | string
    status?: EnumStatusFilter<"UserProjects"> | $Enums.Status
    current_phase?: IntFilter<"UserProjects"> | number
    started_at?: DateTimeFilter<"UserProjects"> | Date | string
    completed_at?: DateTimeNullableFilter<"UserProjects"> | Date | string | null
    archived?: BoolNullableFilter<"UserProjects"> | boolean | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    projects?: XOR<ProjectsScalarRelationFilter, ProjectsWhereInput>
    projectFiles?: ProjectFileListRelationFilter
  }

  export type UserProjectsOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    current_phase?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    archived?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    projects?: ProjectsOrderByWithRelationInput
    projectFiles?: ProjectFileOrderByRelationAggregateInput
  }

  export type UserProjectsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    project_id_user_email?: UserProjectsProject_idUser_emailCompoundUniqueInput
    AND?: UserProjectsWhereInput | UserProjectsWhereInput[]
    OR?: UserProjectsWhereInput[]
    NOT?: UserProjectsWhereInput | UserProjectsWhereInput[]
    project_id?: StringFilter<"UserProjects"> | string
    user_email?: StringFilter<"UserProjects"> | string
    status?: EnumStatusFilter<"UserProjects"> | $Enums.Status
    current_phase?: IntFilter<"UserProjects"> | number
    started_at?: DateTimeFilter<"UserProjects"> | Date | string
    completed_at?: DateTimeNullableFilter<"UserProjects"> | Date | string | null
    archived?: BoolNullableFilter<"UserProjects"> | boolean | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    projects?: XOR<ProjectsScalarRelationFilter, ProjectsWhereInput>
    projectFiles?: ProjectFileListRelationFilter
  }, "id" | "project_id_user_email">

  export type UserProjectsOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    current_phase?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    archived?: SortOrderInput | SortOrder
    _count?: UserProjectsCountOrderByAggregateInput
    _avg?: UserProjectsAvgOrderByAggregateInput
    _max?: UserProjectsMaxOrderByAggregateInput
    _min?: UserProjectsMinOrderByAggregateInput
    _sum?: UserProjectsSumOrderByAggregateInput
  }

  export type UserProjectsScalarWhereWithAggregatesInput = {
    AND?: UserProjectsScalarWhereWithAggregatesInput | UserProjectsScalarWhereWithAggregatesInput[]
    OR?: UserProjectsScalarWhereWithAggregatesInput[]
    NOT?: UserProjectsScalarWhereWithAggregatesInput | UserProjectsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProjects"> | string
    project_id?: StringWithAggregatesFilter<"UserProjects"> | string
    user_email?: StringWithAggregatesFilter<"UserProjects"> | string
    status?: EnumStatusWithAggregatesFilter<"UserProjects"> | $Enums.Status
    current_phase?: IntWithAggregatesFilter<"UserProjects"> | number
    started_at?: DateTimeWithAggregatesFilter<"UserProjects"> | Date | string
    completed_at?: DateTimeNullableWithAggregatesFilter<"UserProjects"> | Date | string | null
    archived?: BoolNullableWithAggregatesFilter<"UserProjects"> | boolean | null
  }

  export type LearningPhaseWhereInput = {
    AND?: LearningPhaseWhereInput | LearningPhaseWhereInput[]
    OR?: LearningPhaseWhereInput[]
    NOT?: LearningPhaseWhereInput | LearningPhaseWhereInput[]
    id?: StringFilter<"LearningPhase"> | string
    project_id?: StringFilter<"LearningPhase"> | string
    title?: StringFilter<"LearningPhase"> | string
    description?: StringFilter<"LearningPhase"> | string
    long_description?: StringFilter<"LearningPhase"> | string
    concepts?: StringNullableListFilter<"LearningPhase">
    goal?: JsonNullableFilter<"LearningPhase">
    phase_number?: IntFilter<"LearningPhase"> | number
    phase_status?: EnumPhaseStatusFilter<"LearningPhase"> | $Enums.PhaseStatus
    estimated_minutes?: IntFilter<"LearningPhase"> | number
    createdAt?: DateTimeFilter<"LearningPhase"> | Date | string
    project?: XOR<ProjectsScalarRelationFilter, ProjectsWhereInput>
    resources?: ResourcesListRelationFilter
    knowledgeChecks?: KnowledgeChecksListRelationFilter
  }

  export type LearningPhaseOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    long_description?: SortOrder
    concepts?: SortOrder
    goal?: SortOrderInput | SortOrder
    phase_number?: SortOrder
    phase_status?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
    project?: ProjectsOrderByWithRelationInput
    resources?: ResourcesOrderByRelationAggregateInput
    knowledgeChecks?: KnowledgeChecksOrderByRelationAggregateInput
  }

  export type LearningPhaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LearningPhaseWhereInput | LearningPhaseWhereInput[]
    OR?: LearningPhaseWhereInput[]
    NOT?: LearningPhaseWhereInput | LearningPhaseWhereInput[]
    project_id?: StringFilter<"LearningPhase"> | string
    title?: StringFilter<"LearningPhase"> | string
    description?: StringFilter<"LearningPhase"> | string
    long_description?: StringFilter<"LearningPhase"> | string
    concepts?: StringNullableListFilter<"LearningPhase">
    goal?: JsonNullableFilter<"LearningPhase">
    phase_number?: IntFilter<"LearningPhase"> | number
    phase_status?: EnumPhaseStatusFilter<"LearningPhase"> | $Enums.PhaseStatus
    estimated_minutes?: IntFilter<"LearningPhase"> | number
    createdAt?: DateTimeFilter<"LearningPhase"> | Date | string
    project?: XOR<ProjectsScalarRelationFilter, ProjectsWhereInput>
    resources?: ResourcesListRelationFilter
    knowledgeChecks?: KnowledgeChecksListRelationFilter
  }, "id">

  export type LearningPhaseOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    long_description?: SortOrder
    concepts?: SortOrder
    goal?: SortOrderInput | SortOrder
    phase_number?: SortOrder
    phase_status?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
    _count?: LearningPhaseCountOrderByAggregateInput
    _avg?: LearningPhaseAvgOrderByAggregateInput
    _max?: LearningPhaseMaxOrderByAggregateInput
    _min?: LearningPhaseMinOrderByAggregateInput
    _sum?: LearningPhaseSumOrderByAggregateInput
  }

  export type LearningPhaseScalarWhereWithAggregatesInput = {
    AND?: LearningPhaseScalarWhereWithAggregatesInput | LearningPhaseScalarWhereWithAggregatesInput[]
    OR?: LearningPhaseScalarWhereWithAggregatesInput[]
    NOT?: LearningPhaseScalarWhereWithAggregatesInput | LearningPhaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LearningPhase"> | string
    project_id?: StringWithAggregatesFilter<"LearningPhase"> | string
    title?: StringWithAggregatesFilter<"LearningPhase"> | string
    description?: StringWithAggregatesFilter<"LearningPhase"> | string
    long_description?: StringWithAggregatesFilter<"LearningPhase"> | string
    concepts?: StringNullableListFilter<"LearningPhase">
    goal?: JsonNullableWithAggregatesFilter<"LearningPhase">
    phase_number?: IntWithAggregatesFilter<"LearningPhase"> | number
    phase_status?: EnumPhaseStatusWithAggregatesFilter<"LearningPhase"> | $Enums.PhaseStatus
    estimated_minutes?: IntWithAggregatesFilter<"LearningPhase"> | number
    createdAt?: DateTimeWithAggregatesFilter<"LearningPhase"> | Date | string
  }

  export type KnowledgeChecksWhereInput = {
    AND?: KnowledgeChecksWhereInput | KnowledgeChecksWhereInput[]
    OR?: KnowledgeChecksWhereInput[]
    NOT?: KnowledgeChecksWhereInput | KnowledgeChecksWhereInput[]
    id?: StringFilter<"KnowledgeChecks"> | string
    phase_id?: StringFilter<"KnowledgeChecks"> | string
    question?: StringFilter<"KnowledgeChecks"> | string
    correct_answer?: StringNullableFilter<"KnowledgeChecks"> | string | null
    explanation?: StringFilter<"KnowledgeChecks"> | string
    question_type?: EnumQuestion_TypeFilter<"KnowledgeChecks"> | $Enums.Question_Type
    learningPhase?: XOR<LearningPhaseScalarRelationFilter, LearningPhaseWhereInput>
  }

  export type KnowledgeChecksOrderByWithRelationInput = {
    id?: SortOrder
    phase_id?: SortOrder
    question?: SortOrder
    correct_answer?: SortOrderInput | SortOrder
    explanation?: SortOrder
    question_type?: SortOrder
    learningPhase?: LearningPhaseOrderByWithRelationInput
  }

  export type KnowledgeChecksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KnowledgeChecksWhereInput | KnowledgeChecksWhereInput[]
    OR?: KnowledgeChecksWhereInput[]
    NOT?: KnowledgeChecksWhereInput | KnowledgeChecksWhereInput[]
    phase_id?: StringFilter<"KnowledgeChecks"> | string
    question?: StringFilter<"KnowledgeChecks"> | string
    correct_answer?: StringNullableFilter<"KnowledgeChecks"> | string | null
    explanation?: StringFilter<"KnowledgeChecks"> | string
    question_type?: EnumQuestion_TypeFilter<"KnowledgeChecks"> | $Enums.Question_Type
    learningPhase?: XOR<LearningPhaseScalarRelationFilter, LearningPhaseWhereInput>
  }, "id">

  export type KnowledgeChecksOrderByWithAggregationInput = {
    id?: SortOrder
    phase_id?: SortOrder
    question?: SortOrder
    correct_answer?: SortOrderInput | SortOrder
    explanation?: SortOrder
    question_type?: SortOrder
    _count?: KnowledgeChecksCountOrderByAggregateInput
    _max?: KnowledgeChecksMaxOrderByAggregateInput
    _min?: KnowledgeChecksMinOrderByAggregateInput
  }

  export type KnowledgeChecksScalarWhereWithAggregatesInput = {
    AND?: KnowledgeChecksScalarWhereWithAggregatesInput | KnowledgeChecksScalarWhereWithAggregatesInput[]
    OR?: KnowledgeChecksScalarWhereWithAggregatesInput[]
    NOT?: KnowledgeChecksScalarWhereWithAggregatesInput | KnowledgeChecksScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KnowledgeChecks"> | string
    phase_id?: StringWithAggregatesFilter<"KnowledgeChecks"> | string
    question?: StringWithAggregatesFilter<"KnowledgeChecks"> | string
    correct_answer?: StringNullableWithAggregatesFilter<"KnowledgeChecks"> | string | null
    explanation?: StringWithAggregatesFilter<"KnowledgeChecks"> | string
    question_type?: EnumQuestion_TypeWithAggregatesFilter<"KnowledgeChecks"> | $Enums.Question_Type
  }

  export type ResourcesWhereInput = {
    AND?: ResourcesWhereInput | ResourcesWhereInput[]
    OR?: ResourcesWhereInput[]
    NOT?: ResourcesWhereInput | ResourcesWhereInput[]
    id?: StringFilter<"Resources"> | string
    phase_id?: StringFilter<"Resources"> | string
    type?: StringFilter<"Resources"> | string
    title?: StringFilter<"Resources"> | string
    url?: StringFilter<"Resources"> | string
    duration_minutes?: IntFilter<"Resources"> | number
    provider?: StringFilter<"Resources"> | string
    timestamps?: JsonNullableFilter<"Resources">
    quality_score?: FloatFilter<"Resources"> | number
    learningPhase?: XOR<LearningPhaseScalarRelationFilter, LearningPhaseWhereInput>
    userProgress?: ResourceProgressListRelationFilter
  }

  export type ResourcesOrderByWithRelationInput = {
    id?: SortOrder
    phase_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    duration_minutes?: SortOrder
    provider?: SortOrder
    timestamps?: SortOrderInput | SortOrder
    quality_score?: SortOrder
    learningPhase?: LearningPhaseOrderByWithRelationInput
    userProgress?: ResourceProgressOrderByRelationAggregateInput
  }

  export type ResourcesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResourcesWhereInput | ResourcesWhereInput[]
    OR?: ResourcesWhereInput[]
    NOT?: ResourcesWhereInput | ResourcesWhereInput[]
    phase_id?: StringFilter<"Resources"> | string
    type?: StringFilter<"Resources"> | string
    title?: StringFilter<"Resources"> | string
    url?: StringFilter<"Resources"> | string
    duration_minutes?: IntFilter<"Resources"> | number
    provider?: StringFilter<"Resources"> | string
    timestamps?: JsonNullableFilter<"Resources">
    quality_score?: FloatFilter<"Resources"> | number
    learningPhase?: XOR<LearningPhaseScalarRelationFilter, LearningPhaseWhereInput>
    userProgress?: ResourceProgressListRelationFilter
  }, "id">

  export type ResourcesOrderByWithAggregationInput = {
    id?: SortOrder
    phase_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    duration_minutes?: SortOrder
    provider?: SortOrder
    timestamps?: SortOrderInput | SortOrder
    quality_score?: SortOrder
    _count?: ResourcesCountOrderByAggregateInput
    _avg?: ResourcesAvgOrderByAggregateInput
    _max?: ResourcesMaxOrderByAggregateInput
    _min?: ResourcesMinOrderByAggregateInput
    _sum?: ResourcesSumOrderByAggregateInput
  }

  export type ResourcesScalarWhereWithAggregatesInput = {
    AND?: ResourcesScalarWhereWithAggregatesInput | ResourcesScalarWhereWithAggregatesInput[]
    OR?: ResourcesScalarWhereWithAggregatesInput[]
    NOT?: ResourcesScalarWhereWithAggregatesInput | ResourcesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resources"> | string
    phase_id?: StringWithAggregatesFilter<"Resources"> | string
    type?: StringWithAggregatesFilter<"Resources"> | string
    title?: StringWithAggregatesFilter<"Resources"> | string
    url?: StringWithAggregatesFilter<"Resources"> | string
    duration_minutes?: IntWithAggregatesFilter<"Resources"> | number
    provider?: StringWithAggregatesFilter<"Resources"> | string
    timestamps?: JsonNullableWithAggregatesFilter<"Resources">
    quality_score?: FloatWithAggregatesFilter<"Resources"> | number
  }

  export type ResourceProgressWhereInput = {
    AND?: ResourceProgressWhereInput | ResourceProgressWhereInput[]
    OR?: ResourceProgressWhereInput[]
    NOT?: ResourceProgressWhereInput | ResourceProgressWhereInput[]
    id?: StringFilter<"ResourceProgress"> | string
    resource_id?: StringFilter<"ResourceProgress"> | string
    user_email?: StringFilter<"ResourceProgress"> | string
    project_id?: StringFilter<"ResourceProgress"> | string
    completed?: BoolFilter<"ResourceProgress"> | boolean
    completed_at?: DateTimeNullableFilter<"ResourceProgress"> | Date | string | null
    created_at?: DateTimeFilter<"ResourceProgress"> | Date | string
    updated_at?: DateTimeFilter<"ResourceProgress"> | Date | string
    resource?: XOR<ResourcesScalarRelationFilter, ResourcesWhereInput>
  }

  export type ResourceProgressOrderByWithRelationInput = {
    id?: SortOrder
    resource_id?: SortOrder
    user_email?: SortOrder
    project_id?: SortOrder
    completed?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    resource?: ResourcesOrderByWithRelationInput
  }

  export type ResourceProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    resource_id_user_email_project_id?: ResourceProgressResource_idUser_emailProject_idCompoundUniqueInput
    AND?: ResourceProgressWhereInput | ResourceProgressWhereInput[]
    OR?: ResourceProgressWhereInput[]
    NOT?: ResourceProgressWhereInput | ResourceProgressWhereInput[]
    resource_id?: StringFilter<"ResourceProgress"> | string
    user_email?: StringFilter<"ResourceProgress"> | string
    project_id?: StringFilter<"ResourceProgress"> | string
    completed?: BoolFilter<"ResourceProgress"> | boolean
    completed_at?: DateTimeNullableFilter<"ResourceProgress"> | Date | string | null
    created_at?: DateTimeFilter<"ResourceProgress"> | Date | string
    updated_at?: DateTimeFilter<"ResourceProgress"> | Date | string
    resource?: XOR<ResourcesScalarRelationFilter, ResourcesWhereInput>
  }, "id" | "resource_id_user_email_project_id">

  export type ResourceProgressOrderByWithAggregationInput = {
    id?: SortOrder
    resource_id?: SortOrder
    user_email?: SortOrder
    project_id?: SortOrder
    completed?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ResourceProgressCountOrderByAggregateInput
    _max?: ResourceProgressMaxOrderByAggregateInput
    _min?: ResourceProgressMinOrderByAggregateInput
  }

  export type ResourceProgressScalarWhereWithAggregatesInput = {
    AND?: ResourceProgressScalarWhereWithAggregatesInput | ResourceProgressScalarWhereWithAggregatesInput[]
    OR?: ResourceProgressScalarWhereWithAggregatesInput[]
    NOT?: ResourceProgressScalarWhereWithAggregatesInput | ResourceProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ResourceProgress"> | string
    resource_id?: StringWithAggregatesFilter<"ResourceProgress"> | string
    user_email?: StringWithAggregatesFilter<"ResourceProgress"> | string
    project_id?: StringWithAggregatesFilter<"ResourceProgress"> | string
    completed?: BoolWithAggregatesFilter<"ResourceProgress"> | boolean
    completed_at?: DateTimeNullableWithAggregatesFilter<"ResourceProgress"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"ResourceProgress"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ResourceProgress"> | Date | string
  }

  export type UserCreateInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
    userProjects?: UserProjectsCreateNestedManyWithoutUserInput
    entranceTestAttempt?: EntranceTestAttemptCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
    userProjects?: UserProjectsUncheckedCreateNestedManyWithoutUserInput
    entranceTestAttempt?: EntranceTestAttemptUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProjects?: UserProjectsUpdateManyWithoutUserNestedInput
    entranceTestAttempt?: EntranceTestAttemptUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProjects?: UserProjectsUncheckedUpdateManyWithoutUserNestedInput
    entranceTestAttempt?: EntranceTestAttemptUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectsCreateInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    learningPhases?: LearningPhaseCreateNestedManyWithoutProjectInput
    userProjects?: UserProjectsCreateNestedManyWithoutProjectsInput
    deliverables?: DeliverableCreateNestedManyWithoutProjectInput
  }

  export type ProjectsUncheckedCreateInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    learningPhases?: LearningPhaseUncheckedCreateNestedManyWithoutProjectInput
    userProjects?: UserProjectsUncheckedCreateNestedManyWithoutProjectsInput
    deliverables?: DeliverableUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningPhases?: LearningPhaseUpdateManyWithoutProjectNestedInput
    userProjects?: UserProjectsUpdateManyWithoutProjectsNestedInput
    deliverables?: DeliverableUpdateManyWithoutProjectNestedInput
  }

  export type ProjectsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningPhases?: LearningPhaseUncheckedUpdateManyWithoutProjectNestedInput
    userProjects?: UserProjectsUncheckedUpdateManyWithoutProjectsNestedInput
    deliverables?: DeliverableUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectsCreateManyInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ProjectsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliverableCreateInput = {
    id?: string
    text: string
    order: number
    project: ProjectsCreateNestedOneWithoutDeliverablesInput
  }

  export type DeliverableUncheckedCreateInput = {
    id?: string
    project_id: string
    text: string
    order: number
  }

  export type DeliverableUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    project?: ProjectsUpdateOneRequiredWithoutDeliverablesNestedInput
  }

  export type DeliverableUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliverableCreateManyInput = {
    id?: string
    project_id: string
    text: string
    order: number
  }

  export type DeliverableUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliverableUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type EntranceQuestionCreateInput = {
    id?: string
    question: string
    options?: EntranceQuestionCreateoptionsInput | string[]
    correct_option: number
    description: string
    explanation: string
    difficulty: $Enums.Difficulty
    topic: string
    createdAt?: Date | string
  }

  export type EntranceQuestionUncheckedCreateInput = {
    id?: string
    question: string
    options?: EntranceQuestionCreateoptionsInput | string[]
    correct_option: number
    description: string
    explanation: string
    difficulty: $Enums.Difficulty
    topic: string
    createdAt?: Date | string
  }

  export type EntranceQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: EntranceQuestionUpdateoptionsInput | string[]
    correct_option?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    topic?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntranceQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: EntranceQuestionUpdateoptionsInput | string[]
    correct_option?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    topic?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntranceQuestionCreateManyInput = {
    id?: string
    question: string
    options?: EntranceQuestionCreateoptionsInput | string[]
    correct_option: number
    description: string
    explanation: string
    difficulty: $Enums.Difficulty
    topic: string
    createdAt?: Date | string
  }

  export type EntranceQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: EntranceQuestionUpdateoptionsInput | string[]
    correct_option?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    topic?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntranceQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: EntranceQuestionUpdateoptionsInput | string[]
    correct_option?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    explanation?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    topic?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntranceTestAttemptCreateInput = {
    id?: string
    status?: $Enums.TestStatus
    round?: number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: $Enums.Skill_Level | null
    started_at?: Date | string
    completed_at?: Date | string | null
    user: UserCreateNestedOneWithoutEntranceTestAttemptInput
  }

  export type EntranceTestAttemptUncheckedCreateInput = {
    id?: string
    user_email: string
    status?: $Enums.TestStatus
    round?: number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: $Enums.Skill_Level | null
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type EntranceTestAttemptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    round?: IntFieldUpdateOperationsInput | number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutEntranceTestAttemptNestedInput
  }

  export type EntranceTestAttemptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    round?: IntFieldUpdateOperationsInput | number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EntranceTestAttemptCreateManyInput = {
    id?: string
    user_email: string
    status?: $Enums.TestStatus
    round?: number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: $Enums.Skill_Level | null
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type EntranceTestAttemptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    round?: IntFieldUpdateOperationsInput | number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EntranceTestAttemptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    round?: IntFieldUpdateOperationsInput | number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProjectFileCreateInput = {
    id?: string
    file_path: string
    content?: string
    is_directory?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    userProject: UserProjectsCreateNestedOneWithoutProjectFilesInput
  }

  export type ProjectFileUncheckedCreateInput = {
    id?: string
    project_id: string
    user_email: string
    file_path: string
    content?: string
    is_directory?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    userProject?: UserProjectsUpdateOneRequiredWithoutProjectFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateManyInput = {
    id?: string
    project_id: string
    user_email: string
    file_path: string
    content?: string
    is_directory?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProjectsCreateInput = {
    id?: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    user: UserCreateNestedOneWithoutUserProjectsInput
    projects: ProjectsCreateNestedOneWithoutUserProjectsInput
    projectFiles?: ProjectFileCreateNestedManyWithoutUserProjectInput
  }

  export type UserProjectsUncheckedCreateInput = {
    id?: string
    project_id: string
    user_email: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutUserProjectInput
  }

  export type UserProjectsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    user?: UserUpdateOneRequiredWithoutUserProjectsNestedInput
    projects?: ProjectsUpdateOneRequiredWithoutUserProjectsNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutUserProjectNestedInput
  }

  export type UserProjectsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutUserProjectNestedInput
  }

  export type UserProjectsCreateManyInput = {
    id?: string
    project_id: string
    user_email: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
  }

  export type UserProjectsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserProjectsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type LearningPhaseCreateInput = {
    id?: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    project: ProjectsCreateNestedOneWithoutLearningPhasesInput
    resources?: ResourcesCreateNestedManyWithoutLearningPhaseInput
    knowledgeChecks?: KnowledgeChecksCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseUncheckedCreateInput = {
    id?: string
    project_id: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    resources?: ResourcesUncheckedCreateNestedManyWithoutLearningPhaseInput
    knowledgeChecks?: KnowledgeChecksUncheckedCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectsUpdateOneRequiredWithoutLearningPhasesNestedInput
    resources?: ResourcesUpdateManyWithoutLearningPhaseNestedInput
    knowledgeChecks?: KnowledgeChecksUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resources?: ResourcesUncheckedUpdateManyWithoutLearningPhaseNestedInput
    knowledgeChecks?: KnowledgeChecksUncheckedUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseCreateManyInput = {
    id?: string
    project_id: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
  }

  export type LearningPhaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LearningPhaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeChecksCreateInput = {
    id?: string
    question: string
    correct_answer?: string | null
    explanation: string
    question_type: $Enums.Question_Type
    learningPhase: LearningPhaseCreateNestedOneWithoutKnowledgeChecksInput
  }

  export type KnowledgeChecksUncheckedCreateInput = {
    id?: string
    phase_id: string
    question: string
    correct_answer?: string | null
    explanation: string
    question_type: $Enums.Question_Type
  }

  export type KnowledgeChecksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
    learningPhase?: LearningPhaseUpdateOneRequiredWithoutKnowledgeChecksNestedInput
  }

  export type KnowledgeChecksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phase_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
  }

  export type KnowledgeChecksCreateManyInput = {
    id?: string
    phase_id: string
    question: string
    correct_answer?: string | null
    explanation: string
    question_type: $Enums.Question_Type
  }

  export type KnowledgeChecksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
  }

  export type KnowledgeChecksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phase_id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
  }

  export type ResourcesCreateInput = {
    id?: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
    learningPhase: LearningPhaseCreateNestedOneWithoutResourcesInput
    userProgress?: ResourceProgressCreateNestedManyWithoutResourceInput
  }

  export type ResourcesUncheckedCreateInput = {
    id?: string
    phase_id: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
    userProgress?: ResourceProgressUncheckedCreateNestedManyWithoutResourceInput
  }

  export type ResourcesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
    learningPhase?: LearningPhaseUpdateOneRequiredWithoutResourcesNestedInput
    userProgress?: ResourceProgressUpdateManyWithoutResourceNestedInput
  }

  export type ResourcesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phase_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
    userProgress?: ResourceProgressUncheckedUpdateManyWithoutResourceNestedInput
  }

  export type ResourcesCreateManyInput = {
    id?: string
    phase_id: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
  }

  export type ResourcesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
  }

  export type ResourcesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phase_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
  }

  export type ResourceProgressCreateInput = {
    id?: string
    user_email: string
    project_id: string
    completed?: boolean
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    resource: ResourcesCreateNestedOneWithoutUserProgressInput
  }

  export type ResourceProgressUncheckedCreateInput = {
    id?: string
    resource_id: string
    user_email: string
    project_id: string
    completed?: boolean
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResourceProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    resource?: ResourcesUpdateOneRequiredWithoutUserProgressNestedInput
  }

  export type ResourceProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceProgressCreateManyInput = {
    id?: string
    resource_id: string
    user_email: string
    project_id: string
    completed?: boolean
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResourceProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumSkill_LevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkill_LevelNullableFilter<$PrismaModel> | $Enums.Skill_Level | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserProjectsListRelationFilter = {
    every?: UserProjectsWhereInput
    some?: UserProjectsWhereInput
    none?: UserProjectsWhereInput
  }

  export type EntranceTestAttemptNullableScalarRelationFilter = {
    is?: EntranceTestAttemptWhereInput | null
    isNot?: EntranceTestAttemptWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserProjectsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    uid?: SortOrder
    email?: SortOrder
    skillLevel?: SortOrder
    learningModes?: SortOrder
    hoursPerWeek?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    hoursPerWeek?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    uid?: SortOrder
    email?: SortOrder
    skillLevel?: SortOrder
    hoursPerWeek?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    uid?: SortOrder
    email?: SortOrder
    skillLevel?: SortOrder
    hoursPerWeek?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    hoursPerWeek?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumSkill_LevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkill_LevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.Skill_Level | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSkill_LevelNullableFilter<$PrismaModel>
    _max?: NestedEnumSkill_LevelNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumSkill_LevelFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel>
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSkill_LevelFilter<$PrismaModel> | $Enums.Skill_Level
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LearningPhaseListRelationFilter = {
    every?: LearningPhaseWhereInput
    some?: LearningPhaseWhereInput
    none?: LearningPhaseWhereInput
  }

  export type DeliverableListRelationFilter = {
    every?: DeliverableWhereInput
    some?: DeliverableWhereInput
    none?: DeliverableWhereInput
  }

  export type LearningPhaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeliverableOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    tech_stack?: SortOrder
    skill_level?: SortOrder
    goal?: SortOrder
    demo_url?: SortOrder
    estimated_minutes?: SortOrder
    initial_files?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectsAvgOrderByAggregateInput = {
    estimated_minutes?: SortOrder
  }

  export type ProjectsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    skill_level?: SortOrder
    goal?: SortOrder
    demo_url?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    skill_level?: SortOrder
    goal?: SortOrder
    demo_url?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectsSumOrderByAggregateInput = {
    estimated_minutes?: SortOrder
  }

  export type EnumSkill_LevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel>
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSkill_LevelWithAggregatesFilter<$PrismaModel> | $Enums.Skill_Level
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSkill_LevelFilter<$PrismaModel>
    _max?: NestedEnumSkill_LevelFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ProjectsScalarRelationFilter = {
    is?: ProjectsWhereInput
    isNot?: ProjectsWhereInput
  }

  export type DeliverableCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    text?: SortOrder
    order?: SortOrder
  }

  export type DeliverableAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type DeliverableMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    text?: SortOrder
    order?: SortOrder
  }

  export type DeliverableMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    text?: SortOrder
    order?: SortOrder
  }

  export type DeliverableSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type EnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type EntranceQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correct_option?: SortOrder
    description?: SortOrder
    explanation?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    createdAt?: SortOrder
  }

  export type EntranceQuestionAvgOrderByAggregateInput = {
    correct_option?: SortOrder
  }

  export type EntranceQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    correct_option?: SortOrder
    description?: SortOrder
    explanation?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    createdAt?: SortOrder
  }

  export type EntranceQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    correct_option?: SortOrder
    description?: SortOrder
    explanation?: SortOrder
    difficulty?: SortOrder
    topic?: SortOrder
    createdAt?: SortOrder
  }

  export type EntranceQuestionSumOrderByAggregateInput = {
    correct_option?: SortOrder
  }

  export type EnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type EnumTestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusFilter<$PrismaModel> | $Enums.TestStatus
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type EntranceTestAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    round?: SortOrder
    answers?: SortOrder
    result_level?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
  }

  export type EntranceTestAttemptAvgOrderByAggregateInput = {
    round?: SortOrder
  }

  export type EntranceTestAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    round?: SortOrder
    result_level?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
  }

  export type EntranceTestAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    round?: SortOrder
    result_level?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
  }

  export type EntranceTestAttemptSumOrderByAggregateInput = {
    round?: SortOrder
  }

  export type EnumTestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusWithAggregatesFilter<$PrismaModel> | $Enums.TestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTestStatusFilter<$PrismaModel>
    _max?: NestedEnumTestStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserProjectsScalarRelationFilter = {
    is?: UserProjectsWhereInput
    isNot?: UserProjectsWhereInput
  }

  export type ProjectFileProject_idUser_emailFile_pathCompoundUniqueInput = {
    project_id: string
    user_email: string
    file_path: string
  }

  export type ProjectFileCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    file_path?: SortOrder
    content?: SortOrder
    is_directory?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectFileMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    file_path?: SortOrder
    content?: SortOrder
    is_directory?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProjectFileMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    file_path?: SortOrder
    content?: SortOrder
    is_directory?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ProjectFileListRelationFilter = {
    every?: ProjectFileWhereInput
    some?: ProjectFileWhereInput
    none?: ProjectFileWhereInput
  }

  export type ProjectFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserProjectsProject_idUser_emailCompoundUniqueInput = {
    project_id: string
    user_email: string
  }

  export type UserProjectsCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    current_phase?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
    archived?: SortOrder
  }

  export type UserProjectsAvgOrderByAggregateInput = {
    current_phase?: SortOrder
  }

  export type UserProjectsMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    current_phase?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
    archived?: SortOrder
  }

  export type UserProjectsMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    user_email?: SortOrder
    status?: SortOrder
    current_phase?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
    archived?: SortOrder
  }

  export type UserProjectsSumOrderByAggregateInput = {
    current_phase?: SortOrder
  }

  export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumPhaseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | EnumPhaseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPhaseStatusFilter<$PrismaModel> | $Enums.PhaseStatus
  }

  export type ResourcesListRelationFilter = {
    every?: ResourcesWhereInput
    some?: ResourcesWhereInput
    none?: ResourcesWhereInput
  }

  export type KnowledgeChecksListRelationFilter = {
    every?: KnowledgeChecksWhereInput
    some?: KnowledgeChecksWhereInput
    none?: KnowledgeChecksWhereInput
  }

  export type ResourcesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KnowledgeChecksOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LearningPhaseCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    long_description?: SortOrder
    concepts?: SortOrder
    goal?: SortOrder
    phase_number?: SortOrder
    phase_status?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
  }

  export type LearningPhaseAvgOrderByAggregateInput = {
    phase_number?: SortOrder
    estimated_minutes?: SortOrder
  }

  export type LearningPhaseMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    long_description?: SortOrder
    phase_number?: SortOrder
    phase_status?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
  }

  export type LearningPhaseMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    long_description?: SortOrder
    phase_number?: SortOrder
    phase_status?: SortOrder
    estimated_minutes?: SortOrder
    createdAt?: SortOrder
  }

  export type LearningPhaseSumOrderByAggregateInput = {
    phase_number?: SortOrder
    estimated_minutes?: SortOrder
  }

  export type EnumPhaseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | EnumPhaseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPhaseStatusWithAggregatesFilter<$PrismaModel> | $Enums.PhaseStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPhaseStatusFilter<$PrismaModel>
    _max?: NestedEnumPhaseStatusFilter<$PrismaModel>
  }

  export type EnumQuestion_TypeFilter<$PrismaModel = never> = {
    equals?: $Enums.Question_Type | EnumQuestion_TypeFieldRefInput<$PrismaModel>
    in?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestion_TypeFilter<$PrismaModel> | $Enums.Question_Type
  }

  export type LearningPhaseScalarRelationFilter = {
    is?: LearningPhaseWhereInput
    isNot?: LearningPhaseWhereInput
  }

  export type KnowledgeChecksCountOrderByAggregateInput = {
    id?: SortOrder
    phase_id?: SortOrder
    question?: SortOrder
    correct_answer?: SortOrder
    explanation?: SortOrder
    question_type?: SortOrder
  }

  export type KnowledgeChecksMaxOrderByAggregateInput = {
    id?: SortOrder
    phase_id?: SortOrder
    question?: SortOrder
    correct_answer?: SortOrder
    explanation?: SortOrder
    question_type?: SortOrder
  }

  export type KnowledgeChecksMinOrderByAggregateInput = {
    id?: SortOrder
    phase_id?: SortOrder
    question?: SortOrder
    correct_answer?: SortOrder
    explanation?: SortOrder
    question_type?: SortOrder
  }

  export type EnumQuestion_TypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Question_Type | EnumQuestion_TypeFieldRefInput<$PrismaModel>
    in?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestion_TypeWithAggregatesFilter<$PrismaModel> | $Enums.Question_Type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestion_TypeFilter<$PrismaModel>
    _max?: NestedEnumQuestion_TypeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ResourceProgressListRelationFilter = {
    every?: ResourceProgressWhereInput
    some?: ResourceProgressWhereInput
    none?: ResourceProgressWhereInput
  }

  export type ResourceProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ResourcesCountOrderByAggregateInput = {
    id?: SortOrder
    phase_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    duration_minutes?: SortOrder
    provider?: SortOrder
    timestamps?: SortOrder
    quality_score?: SortOrder
  }

  export type ResourcesAvgOrderByAggregateInput = {
    duration_minutes?: SortOrder
    quality_score?: SortOrder
  }

  export type ResourcesMaxOrderByAggregateInput = {
    id?: SortOrder
    phase_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    duration_minutes?: SortOrder
    provider?: SortOrder
    quality_score?: SortOrder
  }

  export type ResourcesMinOrderByAggregateInput = {
    id?: SortOrder
    phase_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    duration_minutes?: SortOrder
    provider?: SortOrder
    quality_score?: SortOrder
  }

  export type ResourcesSumOrderByAggregateInput = {
    duration_minutes?: SortOrder
    quality_score?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ResourcesScalarRelationFilter = {
    is?: ResourcesWhereInput
    isNot?: ResourcesWhereInput
  }

  export type ResourceProgressResource_idUser_emailProject_idCompoundUniqueInput = {
    resource_id: string
    user_email: string
    project_id: string
  }

  export type ResourceProgressCountOrderByAggregateInput = {
    id?: SortOrder
    resource_id?: SortOrder
    user_email?: SortOrder
    project_id?: SortOrder
    completed?: SortOrder
    completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ResourceProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    resource_id?: SortOrder
    user_email?: SortOrder
    project_id?: SortOrder
    completed?: SortOrder
    completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ResourceProgressMinOrderByAggregateInput = {
    id?: SortOrder
    resource_id?: SortOrder
    user_email?: SortOrder
    project_id?: SortOrder
    completed?: SortOrder
    completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserCreatelearningModesInput = {
    set: string[]
  }

  export type UserProjectsCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProjectsCreateWithoutUserInput, UserProjectsUncheckedCreateWithoutUserInput> | UserProjectsCreateWithoutUserInput[] | UserProjectsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutUserInput | UserProjectsCreateOrConnectWithoutUserInput[]
    createMany?: UserProjectsCreateManyUserInputEnvelope
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
  }

  export type EntranceTestAttemptCreateNestedOneWithoutUserInput = {
    create?: XOR<EntranceTestAttemptCreateWithoutUserInput, EntranceTestAttemptUncheckedCreateWithoutUserInput>
    connectOrCreate?: EntranceTestAttemptCreateOrConnectWithoutUserInput
    connect?: EntranceTestAttemptWhereUniqueInput
  }

  export type UserProjectsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProjectsCreateWithoutUserInput, UserProjectsUncheckedCreateWithoutUserInput> | UserProjectsCreateWithoutUserInput[] | UserProjectsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutUserInput | UserProjectsCreateOrConnectWithoutUserInput[]
    createMany?: UserProjectsCreateManyUserInputEnvelope
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
  }

  export type EntranceTestAttemptUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<EntranceTestAttemptCreateWithoutUserInput, EntranceTestAttemptUncheckedCreateWithoutUserInput>
    connectOrCreate?: EntranceTestAttemptCreateOrConnectWithoutUserInput
    connect?: EntranceTestAttemptWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableEnumSkill_LevelFieldUpdateOperationsInput = {
    set?: $Enums.Skill_Level | null
  }

  export type UserUpdatelearningModesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserProjectsUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProjectsCreateWithoutUserInput, UserProjectsUncheckedCreateWithoutUserInput> | UserProjectsCreateWithoutUserInput[] | UserProjectsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutUserInput | UserProjectsCreateOrConnectWithoutUserInput[]
    upsert?: UserProjectsUpsertWithWhereUniqueWithoutUserInput | UserProjectsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProjectsCreateManyUserInputEnvelope
    set?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    disconnect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    delete?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    update?: UserProjectsUpdateWithWhereUniqueWithoutUserInput | UserProjectsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProjectsUpdateManyWithWhereWithoutUserInput | UserProjectsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProjectsScalarWhereInput | UserProjectsScalarWhereInput[]
  }

  export type EntranceTestAttemptUpdateOneWithoutUserNestedInput = {
    create?: XOR<EntranceTestAttemptCreateWithoutUserInput, EntranceTestAttemptUncheckedCreateWithoutUserInput>
    connectOrCreate?: EntranceTestAttemptCreateOrConnectWithoutUserInput
    upsert?: EntranceTestAttemptUpsertWithoutUserInput
    disconnect?: EntranceTestAttemptWhereInput | boolean
    delete?: EntranceTestAttemptWhereInput | boolean
    connect?: EntranceTestAttemptWhereUniqueInput
    update?: XOR<XOR<EntranceTestAttemptUpdateToOneWithWhereWithoutUserInput, EntranceTestAttemptUpdateWithoutUserInput>, EntranceTestAttemptUncheckedUpdateWithoutUserInput>
  }

  export type UserProjectsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProjectsCreateWithoutUserInput, UserProjectsUncheckedCreateWithoutUserInput> | UserProjectsCreateWithoutUserInput[] | UserProjectsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutUserInput | UserProjectsCreateOrConnectWithoutUserInput[]
    upsert?: UserProjectsUpsertWithWhereUniqueWithoutUserInput | UserProjectsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProjectsCreateManyUserInputEnvelope
    set?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    disconnect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    delete?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    update?: UserProjectsUpdateWithWhereUniqueWithoutUserInput | UserProjectsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProjectsUpdateManyWithWhereWithoutUserInput | UserProjectsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProjectsScalarWhereInput | UserProjectsScalarWhereInput[]
  }

  export type EntranceTestAttemptUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<EntranceTestAttemptCreateWithoutUserInput, EntranceTestAttemptUncheckedCreateWithoutUserInput>
    connectOrCreate?: EntranceTestAttemptCreateOrConnectWithoutUserInput
    upsert?: EntranceTestAttemptUpsertWithoutUserInput
    disconnect?: EntranceTestAttemptWhereInput | boolean
    delete?: EntranceTestAttemptWhereInput | boolean
    connect?: EntranceTestAttemptWhereUniqueInput
    update?: XOR<XOR<EntranceTestAttemptUpdateToOneWithWhereWithoutUserInput, EntranceTestAttemptUpdateWithoutUserInput>, EntranceTestAttemptUncheckedUpdateWithoutUserInput>
  }

  export type ProjectsCreatetech_stackInput = {
    set: string[]
  }

  export type LearningPhaseCreateNestedManyWithoutProjectInput = {
    create?: XOR<LearningPhaseCreateWithoutProjectInput, LearningPhaseUncheckedCreateWithoutProjectInput> | LearningPhaseCreateWithoutProjectInput[] | LearningPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutProjectInput | LearningPhaseCreateOrConnectWithoutProjectInput[]
    createMany?: LearningPhaseCreateManyProjectInputEnvelope
    connect?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
  }

  export type UserProjectsCreateNestedManyWithoutProjectsInput = {
    create?: XOR<UserProjectsCreateWithoutProjectsInput, UserProjectsUncheckedCreateWithoutProjectsInput> | UserProjectsCreateWithoutProjectsInput[] | UserProjectsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutProjectsInput | UserProjectsCreateOrConnectWithoutProjectsInput[]
    createMany?: UserProjectsCreateManyProjectsInputEnvelope
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
  }

  export type DeliverableCreateNestedManyWithoutProjectInput = {
    create?: XOR<DeliverableCreateWithoutProjectInput, DeliverableUncheckedCreateWithoutProjectInput> | DeliverableCreateWithoutProjectInput[] | DeliverableUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeliverableCreateOrConnectWithoutProjectInput | DeliverableCreateOrConnectWithoutProjectInput[]
    createMany?: DeliverableCreateManyProjectInputEnvelope
    connect?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
  }

  export type LearningPhaseUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<LearningPhaseCreateWithoutProjectInput, LearningPhaseUncheckedCreateWithoutProjectInput> | LearningPhaseCreateWithoutProjectInput[] | LearningPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutProjectInput | LearningPhaseCreateOrConnectWithoutProjectInput[]
    createMany?: LearningPhaseCreateManyProjectInputEnvelope
    connect?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
  }

  export type UserProjectsUncheckedCreateNestedManyWithoutProjectsInput = {
    create?: XOR<UserProjectsCreateWithoutProjectsInput, UserProjectsUncheckedCreateWithoutProjectsInput> | UserProjectsCreateWithoutProjectsInput[] | UserProjectsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutProjectsInput | UserProjectsCreateOrConnectWithoutProjectsInput[]
    createMany?: UserProjectsCreateManyProjectsInputEnvelope
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
  }

  export type DeliverableUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<DeliverableCreateWithoutProjectInput, DeliverableUncheckedCreateWithoutProjectInput> | DeliverableCreateWithoutProjectInput[] | DeliverableUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeliverableCreateOrConnectWithoutProjectInput | DeliverableCreateOrConnectWithoutProjectInput[]
    createMany?: DeliverableCreateManyProjectInputEnvelope
    connect?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
  }

  export type ProjectsUpdatetech_stackInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumSkill_LevelFieldUpdateOperationsInput = {
    set?: $Enums.Skill_Level
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LearningPhaseUpdateManyWithoutProjectNestedInput = {
    create?: XOR<LearningPhaseCreateWithoutProjectInput, LearningPhaseUncheckedCreateWithoutProjectInput> | LearningPhaseCreateWithoutProjectInput[] | LearningPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutProjectInput | LearningPhaseCreateOrConnectWithoutProjectInput[]
    upsert?: LearningPhaseUpsertWithWhereUniqueWithoutProjectInput | LearningPhaseUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: LearningPhaseCreateManyProjectInputEnvelope
    set?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    disconnect?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    delete?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    connect?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    update?: LearningPhaseUpdateWithWhereUniqueWithoutProjectInput | LearningPhaseUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: LearningPhaseUpdateManyWithWhereWithoutProjectInput | LearningPhaseUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: LearningPhaseScalarWhereInput | LearningPhaseScalarWhereInput[]
  }

  export type UserProjectsUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<UserProjectsCreateWithoutProjectsInput, UserProjectsUncheckedCreateWithoutProjectsInput> | UserProjectsCreateWithoutProjectsInput[] | UserProjectsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutProjectsInput | UserProjectsCreateOrConnectWithoutProjectsInput[]
    upsert?: UserProjectsUpsertWithWhereUniqueWithoutProjectsInput | UserProjectsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: UserProjectsCreateManyProjectsInputEnvelope
    set?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    disconnect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    delete?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    update?: UserProjectsUpdateWithWhereUniqueWithoutProjectsInput | UserProjectsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: UserProjectsUpdateManyWithWhereWithoutProjectsInput | UserProjectsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: UserProjectsScalarWhereInput | UserProjectsScalarWhereInput[]
  }

  export type DeliverableUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DeliverableCreateWithoutProjectInput, DeliverableUncheckedCreateWithoutProjectInput> | DeliverableCreateWithoutProjectInput[] | DeliverableUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeliverableCreateOrConnectWithoutProjectInput | DeliverableCreateOrConnectWithoutProjectInput[]
    upsert?: DeliverableUpsertWithWhereUniqueWithoutProjectInput | DeliverableUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DeliverableCreateManyProjectInputEnvelope
    set?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    disconnect?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    delete?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    connect?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    update?: DeliverableUpdateWithWhereUniqueWithoutProjectInput | DeliverableUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DeliverableUpdateManyWithWhereWithoutProjectInput | DeliverableUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DeliverableScalarWhereInput | DeliverableScalarWhereInput[]
  }

  export type LearningPhaseUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<LearningPhaseCreateWithoutProjectInput, LearningPhaseUncheckedCreateWithoutProjectInput> | LearningPhaseCreateWithoutProjectInput[] | LearningPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutProjectInput | LearningPhaseCreateOrConnectWithoutProjectInput[]
    upsert?: LearningPhaseUpsertWithWhereUniqueWithoutProjectInput | LearningPhaseUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: LearningPhaseCreateManyProjectInputEnvelope
    set?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    disconnect?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    delete?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    connect?: LearningPhaseWhereUniqueInput | LearningPhaseWhereUniqueInput[]
    update?: LearningPhaseUpdateWithWhereUniqueWithoutProjectInput | LearningPhaseUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: LearningPhaseUpdateManyWithWhereWithoutProjectInput | LearningPhaseUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: LearningPhaseScalarWhereInput | LearningPhaseScalarWhereInput[]
  }

  export type UserProjectsUncheckedUpdateManyWithoutProjectsNestedInput = {
    create?: XOR<UserProjectsCreateWithoutProjectsInput, UserProjectsUncheckedCreateWithoutProjectsInput> | UserProjectsCreateWithoutProjectsInput[] | UserProjectsUncheckedCreateWithoutProjectsInput[]
    connectOrCreate?: UserProjectsCreateOrConnectWithoutProjectsInput | UserProjectsCreateOrConnectWithoutProjectsInput[]
    upsert?: UserProjectsUpsertWithWhereUniqueWithoutProjectsInput | UserProjectsUpsertWithWhereUniqueWithoutProjectsInput[]
    createMany?: UserProjectsCreateManyProjectsInputEnvelope
    set?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    disconnect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    delete?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    connect?: UserProjectsWhereUniqueInput | UserProjectsWhereUniqueInput[]
    update?: UserProjectsUpdateWithWhereUniqueWithoutProjectsInput | UserProjectsUpdateWithWhereUniqueWithoutProjectsInput[]
    updateMany?: UserProjectsUpdateManyWithWhereWithoutProjectsInput | UserProjectsUpdateManyWithWhereWithoutProjectsInput[]
    deleteMany?: UserProjectsScalarWhereInput | UserProjectsScalarWhereInput[]
  }

  export type DeliverableUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DeliverableCreateWithoutProjectInput, DeliverableUncheckedCreateWithoutProjectInput> | DeliverableCreateWithoutProjectInput[] | DeliverableUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeliverableCreateOrConnectWithoutProjectInput | DeliverableCreateOrConnectWithoutProjectInput[]
    upsert?: DeliverableUpsertWithWhereUniqueWithoutProjectInput | DeliverableUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DeliverableCreateManyProjectInputEnvelope
    set?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    disconnect?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    delete?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    connect?: DeliverableWhereUniqueInput | DeliverableWhereUniqueInput[]
    update?: DeliverableUpdateWithWhereUniqueWithoutProjectInput | DeliverableUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DeliverableUpdateManyWithWhereWithoutProjectInput | DeliverableUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DeliverableScalarWhereInput | DeliverableScalarWhereInput[]
  }

  export type ProjectsCreateNestedOneWithoutDeliverablesInput = {
    create?: XOR<ProjectsCreateWithoutDeliverablesInput, ProjectsUncheckedCreateWithoutDeliverablesInput>
    connectOrCreate?: ProjectsCreateOrConnectWithoutDeliverablesInput
    connect?: ProjectsWhereUniqueInput
  }

  export type ProjectsUpdateOneRequiredWithoutDeliverablesNestedInput = {
    create?: XOR<ProjectsCreateWithoutDeliverablesInput, ProjectsUncheckedCreateWithoutDeliverablesInput>
    connectOrCreate?: ProjectsCreateOrConnectWithoutDeliverablesInput
    upsert?: ProjectsUpsertWithoutDeliverablesInput
    connect?: ProjectsWhereUniqueInput
    update?: XOR<XOR<ProjectsUpdateToOneWithWhereWithoutDeliverablesInput, ProjectsUpdateWithoutDeliverablesInput>, ProjectsUncheckedUpdateWithoutDeliverablesInput>
  }

  export type EntranceQuestionCreateoptionsInput = {
    set: string[]
  }

  export type EntranceQuestionUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumDifficultyFieldUpdateOperationsInput = {
    set?: $Enums.Difficulty
  }

  export type UserCreateNestedOneWithoutEntranceTestAttemptInput = {
    create?: XOR<UserCreateWithoutEntranceTestAttemptInput, UserUncheckedCreateWithoutEntranceTestAttemptInput>
    connectOrCreate?: UserCreateOrConnectWithoutEntranceTestAttemptInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTestStatusFieldUpdateOperationsInput = {
    set?: $Enums.TestStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutEntranceTestAttemptNestedInput = {
    create?: XOR<UserCreateWithoutEntranceTestAttemptInput, UserUncheckedCreateWithoutEntranceTestAttemptInput>
    connectOrCreate?: UserCreateOrConnectWithoutEntranceTestAttemptInput
    upsert?: UserUpsertWithoutEntranceTestAttemptInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEntranceTestAttemptInput, UserUpdateWithoutEntranceTestAttemptInput>, UserUncheckedUpdateWithoutEntranceTestAttemptInput>
  }

  export type UserProjectsCreateNestedOneWithoutProjectFilesInput = {
    create?: XOR<UserProjectsCreateWithoutProjectFilesInput, UserProjectsUncheckedCreateWithoutProjectFilesInput>
    connectOrCreate?: UserProjectsCreateOrConnectWithoutProjectFilesInput
    connect?: UserProjectsWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserProjectsUpdateOneRequiredWithoutProjectFilesNestedInput = {
    create?: XOR<UserProjectsCreateWithoutProjectFilesInput, UserProjectsUncheckedCreateWithoutProjectFilesInput>
    connectOrCreate?: UserProjectsCreateOrConnectWithoutProjectFilesInput
    upsert?: UserProjectsUpsertWithoutProjectFilesInput
    connect?: UserProjectsWhereUniqueInput
    update?: XOR<XOR<UserProjectsUpdateToOneWithWhereWithoutProjectFilesInput, UserProjectsUpdateWithoutProjectFilesInput>, UserProjectsUncheckedUpdateWithoutProjectFilesInput>
  }

  export type UserCreateNestedOneWithoutUserProjectsInput = {
    create?: XOR<UserCreateWithoutUserProjectsInput, UserUncheckedCreateWithoutUserProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectsCreateNestedOneWithoutUserProjectsInput = {
    create?: XOR<ProjectsCreateWithoutUserProjectsInput, ProjectsUncheckedCreateWithoutUserProjectsInput>
    connectOrCreate?: ProjectsCreateOrConnectWithoutUserProjectsInput
    connect?: ProjectsWhereUniqueInput
  }

  export type ProjectFileCreateNestedManyWithoutUserProjectInput = {
    create?: XOR<ProjectFileCreateWithoutUserProjectInput, ProjectFileUncheckedCreateWithoutUserProjectInput> | ProjectFileCreateWithoutUserProjectInput[] | ProjectFileUncheckedCreateWithoutUserProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutUserProjectInput | ProjectFileCreateOrConnectWithoutUserProjectInput[]
    createMany?: ProjectFileCreateManyUserProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutUserProjectInput = {
    create?: XOR<ProjectFileCreateWithoutUserProjectInput, ProjectFileUncheckedCreateWithoutUserProjectInput> | ProjectFileCreateWithoutUserProjectInput[] | ProjectFileUncheckedCreateWithoutUserProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutUserProjectInput | ProjectFileCreateOrConnectWithoutUserProjectInput[]
    createMany?: ProjectFileCreateManyUserProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type UserUpdateOneRequiredWithoutUserProjectsNestedInput = {
    create?: XOR<UserCreateWithoutUserProjectsInput, UserUncheckedCreateWithoutUserProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserProjectsInput
    upsert?: UserUpsertWithoutUserProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserProjectsInput, UserUpdateWithoutUserProjectsInput>, UserUncheckedUpdateWithoutUserProjectsInput>
  }

  export type ProjectsUpdateOneRequiredWithoutUserProjectsNestedInput = {
    create?: XOR<ProjectsCreateWithoutUserProjectsInput, ProjectsUncheckedCreateWithoutUserProjectsInput>
    connectOrCreate?: ProjectsCreateOrConnectWithoutUserProjectsInput
    upsert?: ProjectsUpsertWithoutUserProjectsInput
    connect?: ProjectsWhereUniqueInput
    update?: XOR<XOR<ProjectsUpdateToOneWithWhereWithoutUserProjectsInput, ProjectsUpdateWithoutUserProjectsInput>, ProjectsUncheckedUpdateWithoutUserProjectsInput>
  }

  export type ProjectFileUpdateManyWithoutUserProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutUserProjectInput, ProjectFileUncheckedCreateWithoutUserProjectInput> | ProjectFileCreateWithoutUserProjectInput[] | ProjectFileUncheckedCreateWithoutUserProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutUserProjectInput | ProjectFileCreateOrConnectWithoutUserProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutUserProjectInput | ProjectFileUpsertWithWhereUniqueWithoutUserProjectInput[]
    createMany?: ProjectFileCreateManyUserProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutUserProjectInput | ProjectFileUpdateWithWhereUniqueWithoutUserProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutUserProjectInput | ProjectFileUpdateManyWithWhereWithoutUserProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectFileUncheckedUpdateManyWithoutUserProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutUserProjectInput, ProjectFileUncheckedCreateWithoutUserProjectInput> | ProjectFileCreateWithoutUserProjectInput[] | ProjectFileUncheckedCreateWithoutUserProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutUserProjectInput | ProjectFileCreateOrConnectWithoutUserProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutUserProjectInput | ProjectFileUpsertWithWhereUniqueWithoutUserProjectInput[]
    createMany?: ProjectFileCreateManyUserProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutUserProjectInput | ProjectFileUpdateWithWhereUniqueWithoutUserProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutUserProjectInput | ProjectFileUpdateManyWithWhereWithoutUserProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type LearningPhaseCreateconceptsInput = {
    set: string[]
  }

  export type ProjectsCreateNestedOneWithoutLearningPhasesInput = {
    create?: XOR<ProjectsCreateWithoutLearningPhasesInput, ProjectsUncheckedCreateWithoutLearningPhasesInput>
    connectOrCreate?: ProjectsCreateOrConnectWithoutLearningPhasesInput
    connect?: ProjectsWhereUniqueInput
  }

  export type ResourcesCreateNestedManyWithoutLearningPhaseInput = {
    create?: XOR<ResourcesCreateWithoutLearningPhaseInput, ResourcesUncheckedCreateWithoutLearningPhaseInput> | ResourcesCreateWithoutLearningPhaseInput[] | ResourcesUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: ResourcesCreateOrConnectWithoutLearningPhaseInput | ResourcesCreateOrConnectWithoutLearningPhaseInput[]
    createMany?: ResourcesCreateManyLearningPhaseInputEnvelope
    connect?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
  }

  export type KnowledgeChecksCreateNestedManyWithoutLearningPhaseInput = {
    create?: XOR<KnowledgeChecksCreateWithoutLearningPhaseInput, KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput> | KnowledgeChecksCreateWithoutLearningPhaseInput[] | KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput | KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput[]
    createMany?: KnowledgeChecksCreateManyLearningPhaseInputEnvelope
    connect?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
  }

  export type ResourcesUncheckedCreateNestedManyWithoutLearningPhaseInput = {
    create?: XOR<ResourcesCreateWithoutLearningPhaseInput, ResourcesUncheckedCreateWithoutLearningPhaseInput> | ResourcesCreateWithoutLearningPhaseInput[] | ResourcesUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: ResourcesCreateOrConnectWithoutLearningPhaseInput | ResourcesCreateOrConnectWithoutLearningPhaseInput[]
    createMany?: ResourcesCreateManyLearningPhaseInputEnvelope
    connect?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
  }

  export type KnowledgeChecksUncheckedCreateNestedManyWithoutLearningPhaseInput = {
    create?: XOR<KnowledgeChecksCreateWithoutLearningPhaseInput, KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput> | KnowledgeChecksCreateWithoutLearningPhaseInput[] | KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput | KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput[]
    createMany?: KnowledgeChecksCreateManyLearningPhaseInputEnvelope
    connect?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
  }

  export type LearningPhaseUpdateconceptsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumPhaseStatusFieldUpdateOperationsInput = {
    set?: $Enums.PhaseStatus
  }

  export type ProjectsUpdateOneRequiredWithoutLearningPhasesNestedInput = {
    create?: XOR<ProjectsCreateWithoutLearningPhasesInput, ProjectsUncheckedCreateWithoutLearningPhasesInput>
    connectOrCreate?: ProjectsCreateOrConnectWithoutLearningPhasesInput
    upsert?: ProjectsUpsertWithoutLearningPhasesInput
    connect?: ProjectsWhereUniqueInput
    update?: XOR<XOR<ProjectsUpdateToOneWithWhereWithoutLearningPhasesInput, ProjectsUpdateWithoutLearningPhasesInput>, ProjectsUncheckedUpdateWithoutLearningPhasesInput>
  }

  export type ResourcesUpdateManyWithoutLearningPhaseNestedInput = {
    create?: XOR<ResourcesCreateWithoutLearningPhaseInput, ResourcesUncheckedCreateWithoutLearningPhaseInput> | ResourcesCreateWithoutLearningPhaseInput[] | ResourcesUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: ResourcesCreateOrConnectWithoutLearningPhaseInput | ResourcesCreateOrConnectWithoutLearningPhaseInput[]
    upsert?: ResourcesUpsertWithWhereUniqueWithoutLearningPhaseInput | ResourcesUpsertWithWhereUniqueWithoutLearningPhaseInput[]
    createMany?: ResourcesCreateManyLearningPhaseInputEnvelope
    set?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    disconnect?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    delete?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    connect?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    update?: ResourcesUpdateWithWhereUniqueWithoutLearningPhaseInput | ResourcesUpdateWithWhereUniqueWithoutLearningPhaseInput[]
    updateMany?: ResourcesUpdateManyWithWhereWithoutLearningPhaseInput | ResourcesUpdateManyWithWhereWithoutLearningPhaseInput[]
    deleteMany?: ResourcesScalarWhereInput | ResourcesScalarWhereInput[]
  }

  export type KnowledgeChecksUpdateManyWithoutLearningPhaseNestedInput = {
    create?: XOR<KnowledgeChecksCreateWithoutLearningPhaseInput, KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput> | KnowledgeChecksCreateWithoutLearningPhaseInput[] | KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput | KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput[]
    upsert?: KnowledgeChecksUpsertWithWhereUniqueWithoutLearningPhaseInput | KnowledgeChecksUpsertWithWhereUniqueWithoutLearningPhaseInput[]
    createMany?: KnowledgeChecksCreateManyLearningPhaseInputEnvelope
    set?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    disconnect?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    delete?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    connect?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    update?: KnowledgeChecksUpdateWithWhereUniqueWithoutLearningPhaseInput | KnowledgeChecksUpdateWithWhereUniqueWithoutLearningPhaseInput[]
    updateMany?: KnowledgeChecksUpdateManyWithWhereWithoutLearningPhaseInput | KnowledgeChecksUpdateManyWithWhereWithoutLearningPhaseInput[]
    deleteMany?: KnowledgeChecksScalarWhereInput | KnowledgeChecksScalarWhereInput[]
  }

  export type ResourcesUncheckedUpdateManyWithoutLearningPhaseNestedInput = {
    create?: XOR<ResourcesCreateWithoutLearningPhaseInput, ResourcesUncheckedCreateWithoutLearningPhaseInput> | ResourcesCreateWithoutLearningPhaseInput[] | ResourcesUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: ResourcesCreateOrConnectWithoutLearningPhaseInput | ResourcesCreateOrConnectWithoutLearningPhaseInput[]
    upsert?: ResourcesUpsertWithWhereUniqueWithoutLearningPhaseInput | ResourcesUpsertWithWhereUniqueWithoutLearningPhaseInput[]
    createMany?: ResourcesCreateManyLearningPhaseInputEnvelope
    set?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    disconnect?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    delete?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    connect?: ResourcesWhereUniqueInput | ResourcesWhereUniqueInput[]
    update?: ResourcesUpdateWithWhereUniqueWithoutLearningPhaseInput | ResourcesUpdateWithWhereUniqueWithoutLearningPhaseInput[]
    updateMany?: ResourcesUpdateManyWithWhereWithoutLearningPhaseInput | ResourcesUpdateManyWithWhereWithoutLearningPhaseInput[]
    deleteMany?: ResourcesScalarWhereInput | ResourcesScalarWhereInput[]
  }

  export type KnowledgeChecksUncheckedUpdateManyWithoutLearningPhaseNestedInput = {
    create?: XOR<KnowledgeChecksCreateWithoutLearningPhaseInput, KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput> | KnowledgeChecksCreateWithoutLearningPhaseInput[] | KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput[]
    connectOrCreate?: KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput | KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput[]
    upsert?: KnowledgeChecksUpsertWithWhereUniqueWithoutLearningPhaseInput | KnowledgeChecksUpsertWithWhereUniqueWithoutLearningPhaseInput[]
    createMany?: KnowledgeChecksCreateManyLearningPhaseInputEnvelope
    set?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    disconnect?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    delete?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    connect?: KnowledgeChecksWhereUniqueInput | KnowledgeChecksWhereUniqueInput[]
    update?: KnowledgeChecksUpdateWithWhereUniqueWithoutLearningPhaseInput | KnowledgeChecksUpdateWithWhereUniqueWithoutLearningPhaseInput[]
    updateMany?: KnowledgeChecksUpdateManyWithWhereWithoutLearningPhaseInput | KnowledgeChecksUpdateManyWithWhereWithoutLearningPhaseInput[]
    deleteMany?: KnowledgeChecksScalarWhereInput | KnowledgeChecksScalarWhereInput[]
  }

  export type LearningPhaseCreateNestedOneWithoutKnowledgeChecksInput = {
    create?: XOR<LearningPhaseCreateWithoutKnowledgeChecksInput, LearningPhaseUncheckedCreateWithoutKnowledgeChecksInput>
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutKnowledgeChecksInput
    connect?: LearningPhaseWhereUniqueInput
  }

  export type EnumQuestion_TypeFieldUpdateOperationsInput = {
    set?: $Enums.Question_Type
  }

  export type LearningPhaseUpdateOneRequiredWithoutKnowledgeChecksNestedInput = {
    create?: XOR<LearningPhaseCreateWithoutKnowledgeChecksInput, LearningPhaseUncheckedCreateWithoutKnowledgeChecksInput>
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutKnowledgeChecksInput
    upsert?: LearningPhaseUpsertWithoutKnowledgeChecksInput
    connect?: LearningPhaseWhereUniqueInput
    update?: XOR<XOR<LearningPhaseUpdateToOneWithWhereWithoutKnowledgeChecksInput, LearningPhaseUpdateWithoutKnowledgeChecksInput>, LearningPhaseUncheckedUpdateWithoutKnowledgeChecksInput>
  }

  export type LearningPhaseCreateNestedOneWithoutResourcesInput = {
    create?: XOR<LearningPhaseCreateWithoutResourcesInput, LearningPhaseUncheckedCreateWithoutResourcesInput>
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutResourcesInput
    connect?: LearningPhaseWhereUniqueInput
  }

  export type ResourceProgressCreateNestedManyWithoutResourceInput = {
    create?: XOR<ResourceProgressCreateWithoutResourceInput, ResourceProgressUncheckedCreateWithoutResourceInput> | ResourceProgressCreateWithoutResourceInput[] | ResourceProgressUncheckedCreateWithoutResourceInput[]
    connectOrCreate?: ResourceProgressCreateOrConnectWithoutResourceInput | ResourceProgressCreateOrConnectWithoutResourceInput[]
    createMany?: ResourceProgressCreateManyResourceInputEnvelope
    connect?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
  }

  export type ResourceProgressUncheckedCreateNestedManyWithoutResourceInput = {
    create?: XOR<ResourceProgressCreateWithoutResourceInput, ResourceProgressUncheckedCreateWithoutResourceInput> | ResourceProgressCreateWithoutResourceInput[] | ResourceProgressUncheckedCreateWithoutResourceInput[]
    connectOrCreate?: ResourceProgressCreateOrConnectWithoutResourceInput | ResourceProgressCreateOrConnectWithoutResourceInput[]
    createMany?: ResourceProgressCreateManyResourceInputEnvelope
    connect?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LearningPhaseUpdateOneRequiredWithoutResourcesNestedInput = {
    create?: XOR<LearningPhaseCreateWithoutResourcesInput, LearningPhaseUncheckedCreateWithoutResourcesInput>
    connectOrCreate?: LearningPhaseCreateOrConnectWithoutResourcesInput
    upsert?: LearningPhaseUpsertWithoutResourcesInput
    connect?: LearningPhaseWhereUniqueInput
    update?: XOR<XOR<LearningPhaseUpdateToOneWithWhereWithoutResourcesInput, LearningPhaseUpdateWithoutResourcesInput>, LearningPhaseUncheckedUpdateWithoutResourcesInput>
  }

  export type ResourceProgressUpdateManyWithoutResourceNestedInput = {
    create?: XOR<ResourceProgressCreateWithoutResourceInput, ResourceProgressUncheckedCreateWithoutResourceInput> | ResourceProgressCreateWithoutResourceInput[] | ResourceProgressUncheckedCreateWithoutResourceInput[]
    connectOrCreate?: ResourceProgressCreateOrConnectWithoutResourceInput | ResourceProgressCreateOrConnectWithoutResourceInput[]
    upsert?: ResourceProgressUpsertWithWhereUniqueWithoutResourceInput | ResourceProgressUpsertWithWhereUniqueWithoutResourceInput[]
    createMany?: ResourceProgressCreateManyResourceInputEnvelope
    set?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    disconnect?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    delete?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    connect?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    update?: ResourceProgressUpdateWithWhereUniqueWithoutResourceInput | ResourceProgressUpdateWithWhereUniqueWithoutResourceInput[]
    updateMany?: ResourceProgressUpdateManyWithWhereWithoutResourceInput | ResourceProgressUpdateManyWithWhereWithoutResourceInput[]
    deleteMany?: ResourceProgressScalarWhereInput | ResourceProgressScalarWhereInput[]
  }

  export type ResourceProgressUncheckedUpdateManyWithoutResourceNestedInput = {
    create?: XOR<ResourceProgressCreateWithoutResourceInput, ResourceProgressUncheckedCreateWithoutResourceInput> | ResourceProgressCreateWithoutResourceInput[] | ResourceProgressUncheckedCreateWithoutResourceInput[]
    connectOrCreate?: ResourceProgressCreateOrConnectWithoutResourceInput | ResourceProgressCreateOrConnectWithoutResourceInput[]
    upsert?: ResourceProgressUpsertWithWhereUniqueWithoutResourceInput | ResourceProgressUpsertWithWhereUniqueWithoutResourceInput[]
    createMany?: ResourceProgressCreateManyResourceInputEnvelope
    set?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    disconnect?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    delete?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    connect?: ResourceProgressWhereUniqueInput | ResourceProgressWhereUniqueInput[]
    update?: ResourceProgressUpdateWithWhereUniqueWithoutResourceInput | ResourceProgressUpdateWithWhereUniqueWithoutResourceInput[]
    updateMany?: ResourceProgressUpdateManyWithWhereWithoutResourceInput | ResourceProgressUpdateManyWithWhereWithoutResourceInput[]
    deleteMany?: ResourceProgressScalarWhereInput | ResourceProgressScalarWhereInput[]
  }

  export type ResourcesCreateNestedOneWithoutUserProgressInput = {
    create?: XOR<ResourcesCreateWithoutUserProgressInput, ResourcesUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: ResourcesCreateOrConnectWithoutUserProgressInput
    connect?: ResourcesWhereUniqueInput
  }

  export type ResourcesUpdateOneRequiredWithoutUserProgressNestedInput = {
    create?: XOR<ResourcesCreateWithoutUserProgressInput, ResourcesUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: ResourcesCreateOrConnectWithoutUserProgressInput
    upsert?: ResourcesUpsertWithoutUserProgressInput
    connect?: ResourcesWhereUniqueInput
    update?: XOR<XOR<ResourcesUpdateToOneWithWhereWithoutUserProgressInput, ResourcesUpdateWithoutUserProgressInput>, ResourcesUncheckedUpdateWithoutUserProgressInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumSkill_LevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkill_LevelNullableFilter<$PrismaModel> | $Enums.Skill_Level | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumSkill_LevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkill_LevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.Skill_Level | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSkill_LevelNullableFilter<$PrismaModel>
    _max?: NestedEnumSkill_LevelNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSkill_LevelFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel>
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSkill_LevelFilter<$PrismaModel> | $Enums.Skill_Level
  }

  export type NestedEnumSkill_LevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Skill_Level | EnumSkill_LevelFieldRefInput<$PrismaModel>
    in?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Skill_Level[] | ListEnumSkill_LevelFieldRefInput<$PrismaModel>
    not?: NestedEnumSkill_LevelWithAggregatesFilter<$PrismaModel> | $Enums.Skill_Level
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSkill_LevelFilter<$PrismaModel>
    _max?: NestedEnumSkill_LevelFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type NestedEnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type NestedEnumTestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusFilter<$PrismaModel> | $Enums.TestStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestStatus | EnumTestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TestStatus[] | ListEnumTestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTestStatusWithAggregatesFilter<$PrismaModel> | $Enums.TestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTestStatusFilter<$PrismaModel>
    _max?: NestedEnumTestStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumPhaseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | EnumPhaseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPhaseStatusFilter<$PrismaModel> | $Enums.PhaseStatus
  }

  export type NestedEnumPhaseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhaseStatus | EnumPhaseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PhaseStatus[] | ListEnumPhaseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPhaseStatusWithAggregatesFilter<$PrismaModel> | $Enums.PhaseStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPhaseStatusFilter<$PrismaModel>
    _max?: NestedEnumPhaseStatusFilter<$PrismaModel>
  }

  export type NestedEnumQuestion_TypeFilter<$PrismaModel = never> = {
    equals?: $Enums.Question_Type | EnumQuestion_TypeFieldRefInput<$PrismaModel>
    in?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestion_TypeFilter<$PrismaModel> | $Enums.Question_Type
  }

  export type NestedEnumQuestion_TypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Question_Type | EnumQuestion_TypeFieldRefInput<$PrismaModel>
    in?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Question_Type[] | ListEnumQuestion_TypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestion_TypeWithAggregatesFilter<$PrismaModel> | $Enums.Question_Type
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestion_TypeFilter<$PrismaModel>
    _max?: NestedEnumQuestion_TypeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type UserProjectsCreateWithoutUserInput = {
    id?: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    projects: ProjectsCreateNestedOneWithoutUserProjectsInput
    projectFiles?: ProjectFileCreateNestedManyWithoutUserProjectInput
  }

  export type UserProjectsUncheckedCreateWithoutUserInput = {
    id?: string
    project_id: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutUserProjectInput
  }

  export type UserProjectsCreateOrConnectWithoutUserInput = {
    where: UserProjectsWhereUniqueInput
    create: XOR<UserProjectsCreateWithoutUserInput, UserProjectsUncheckedCreateWithoutUserInput>
  }

  export type UserProjectsCreateManyUserInputEnvelope = {
    data: UserProjectsCreateManyUserInput | UserProjectsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EntranceTestAttemptCreateWithoutUserInput = {
    id?: string
    status?: $Enums.TestStatus
    round?: number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: $Enums.Skill_Level | null
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type EntranceTestAttemptUncheckedCreateWithoutUserInput = {
    id?: string
    status?: $Enums.TestStatus
    round?: number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: $Enums.Skill_Level | null
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type EntranceTestAttemptCreateOrConnectWithoutUserInput = {
    where: EntranceTestAttemptWhereUniqueInput
    create: XOR<EntranceTestAttemptCreateWithoutUserInput, EntranceTestAttemptUncheckedCreateWithoutUserInput>
  }

  export type UserProjectsUpsertWithWhereUniqueWithoutUserInput = {
    where: UserProjectsWhereUniqueInput
    update: XOR<UserProjectsUpdateWithoutUserInput, UserProjectsUncheckedUpdateWithoutUserInput>
    create: XOR<UserProjectsCreateWithoutUserInput, UserProjectsUncheckedCreateWithoutUserInput>
  }

  export type UserProjectsUpdateWithWhereUniqueWithoutUserInput = {
    where: UserProjectsWhereUniqueInput
    data: XOR<UserProjectsUpdateWithoutUserInput, UserProjectsUncheckedUpdateWithoutUserInput>
  }

  export type UserProjectsUpdateManyWithWhereWithoutUserInput = {
    where: UserProjectsScalarWhereInput
    data: XOR<UserProjectsUpdateManyMutationInput, UserProjectsUncheckedUpdateManyWithoutUserInput>
  }

  export type UserProjectsScalarWhereInput = {
    AND?: UserProjectsScalarWhereInput | UserProjectsScalarWhereInput[]
    OR?: UserProjectsScalarWhereInput[]
    NOT?: UserProjectsScalarWhereInput | UserProjectsScalarWhereInput[]
    id?: StringFilter<"UserProjects"> | string
    project_id?: StringFilter<"UserProjects"> | string
    user_email?: StringFilter<"UserProjects"> | string
    status?: EnumStatusFilter<"UserProjects"> | $Enums.Status
    current_phase?: IntFilter<"UserProjects"> | number
    started_at?: DateTimeFilter<"UserProjects"> | Date | string
    completed_at?: DateTimeNullableFilter<"UserProjects"> | Date | string | null
    archived?: BoolNullableFilter<"UserProjects"> | boolean | null
  }

  export type EntranceTestAttemptUpsertWithoutUserInput = {
    update: XOR<EntranceTestAttemptUpdateWithoutUserInput, EntranceTestAttemptUncheckedUpdateWithoutUserInput>
    create: XOR<EntranceTestAttemptCreateWithoutUserInput, EntranceTestAttemptUncheckedCreateWithoutUserInput>
    where?: EntranceTestAttemptWhereInput
  }

  export type EntranceTestAttemptUpdateToOneWithWhereWithoutUserInput = {
    where?: EntranceTestAttemptWhereInput
    data: XOR<EntranceTestAttemptUpdateWithoutUserInput, EntranceTestAttemptUncheckedUpdateWithoutUserInput>
  }

  export type EntranceTestAttemptUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    round?: IntFieldUpdateOperationsInput | number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EntranceTestAttemptUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTestStatusFieldUpdateOperationsInput | $Enums.TestStatus
    round?: IntFieldUpdateOperationsInput | number
    answers?: JsonNullValueInput | InputJsonValue
    result_level?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LearningPhaseCreateWithoutProjectInput = {
    id?: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    resources?: ResourcesCreateNestedManyWithoutLearningPhaseInput
    knowledgeChecks?: KnowledgeChecksCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseUncheckedCreateWithoutProjectInput = {
    id?: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    resources?: ResourcesUncheckedCreateNestedManyWithoutLearningPhaseInput
    knowledgeChecks?: KnowledgeChecksUncheckedCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseCreateOrConnectWithoutProjectInput = {
    where: LearningPhaseWhereUniqueInput
    create: XOR<LearningPhaseCreateWithoutProjectInput, LearningPhaseUncheckedCreateWithoutProjectInput>
  }

  export type LearningPhaseCreateManyProjectInputEnvelope = {
    data: LearningPhaseCreateManyProjectInput | LearningPhaseCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserProjectsCreateWithoutProjectsInput = {
    id?: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    user: UserCreateNestedOneWithoutUserProjectsInput
    projectFiles?: ProjectFileCreateNestedManyWithoutUserProjectInput
  }

  export type UserProjectsUncheckedCreateWithoutProjectsInput = {
    id?: string
    user_email: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    projectFiles?: ProjectFileUncheckedCreateNestedManyWithoutUserProjectInput
  }

  export type UserProjectsCreateOrConnectWithoutProjectsInput = {
    where: UserProjectsWhereUniqueInput
    create: XOR<UserProjectsCreateWithoutProjectsInput, UserProjectsUncheckedCreateWithoutProjectsInput>
  }

  export type UserProjectsCreateManyProjectsInputEnvelope = {
    data: UserProjectsCreateManyProjectsInput | UserProjectsCreateManyProjectsInput[]
    skipDuplicates?: boolean
  }

  export type DeliverableCreateWithoutProjectInput = {
    id?: string
    text: string
    order: number
  }

  export type DeliverableUncheckedCreateWithoutProjectInput = {
    id?: string
    text: string
    order: number
  }

  export type DeliverableCreateOrConnectWithoutProjectInput = {
    where: DeliverableWhereUniqueInput
    create: XOR<DeliverableCreateWithoutProjectInput, DeliverableUncheckedCreateWithoutProjectInput>
  }

  export type DeliverableCreateManyProjectInputEnvelope = {
    data: DeliverableCreateManyProjectInput | DeliverableCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type LearningPhaseUpsertWithWhereUniqueWithoutProjectInput = {
    where: LearningPhaseWhereUniqueInput
    update: XOR<LearningPhaseUpdateWithoutProjectInput, LearningPhaseUncheckedUpdateWithoutProjectInput>
    create: XOR<LearningPhaseCreateWithoutProjectInput, LearningPhaseUncheckedCreateWithoutProjectInput>
  }

  export type LearningPhaseUpdateWithWhereUniqueWithoutProjectInput = {
    where: LearningPhaseWhereUniqueInput
    data: XOR<LearningPhaseUpdateWithoutProjectInput, LearningPhaseUncheckedUpdateWithoutProjectInput>
  }

  export type LearningPhaseUpdateManyWithWhereWithoutProjectInput = {
    where: LearningPhaseScalarWhereInput
    data: XOR<LearningPhaseUpdateManyMutationInput, LearningPhaseUncheckedUpdateManyWithoutProjectInput>
  }

  export type LearningPhaseScalarWhereInput = {
    AND?: LearningPhaseScalarWhereInput | LearningPhaseScalarWhereInput[]
    OR?: LearningPhaseScalarWhereInput[]
    NOT?: LearningPhaseScalarWhereInput | LearningPhaseScalarWhereInput[]
    id?: StringFilter<"LearningPhase"> | string
    project_id?: StringFilter<"LearningPhase"> | string
    title?: StringFilter<"LearningPhase"> | string
    description?: StringFilter<"LearningPhase"> | string
    long_description?: StringFilter<"LearningPhase"> | string
    concepts?: StringNullableListFilter<"LearningPhase">
    goal?: JsonNullableFilter<"LearningPhase">
    phase_number?: IntFilter<"LearningPhase"> | number
    phase_status?: EnumPhaseStatusFilter<"LearningPhase"> | $Enums.PhaseStatus
    estimated_minutes?: IntFilter<"LearningPhase"> | number
    createdAt?: DateTimeFilter<"LearningPhase"> | Date | string
  }

  export type UserProjectsUpsertWithWhereUniqueWithoutProjectsInput = {
    where: UserProjectsWhereUniqueInput
    update: XOR<UserProjectsUpdateWithoutProjectsInput, UserProjectsUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserProjectsCreateWithoutProjectsInput, UserProjectsUncheckedCreateWithoutProjectsInput>
  }

  export type UserProjectsUpdateWithWhereUniqueWithoutProjectsInput = {
    where: UserProjectsWhereUniqueInput
    data: XOR<UserProjectsUpdateWithoutProjectsInput, UserProjectsUncheckedUpdateWithoutProjectsInput>
  }

  export type UserProjectsUpdateManyWithWhereWithoutProjectsInput = {
    where: UserProjectsScalarWhereInput
    data: XOR<UserProjectsUpdateManyMutationInput, UserProjectsUncheckedUpdateManyWithoutProjectsInput>
  }

  export type DeliverableUpsertWithWhereUniqueWithoutProjectInput = {
    where: DeliverableWhereUniqueInput
    update: XOR<DeliverableUpdateWithoutProjectInput, DeliverableUncheckedUpdateWithoutProjectInput>
    create: XOR<DeliverableCreateWithoutProjectInput, DeliverableUncheckedCreateWithoutProjectInput>
  }

  export type DeliverableUpdateWithWhereUniqueWithoutProjectInput = {
    where: DeliverableWhereUniqueInput
    data: XOR<DeliverableUpdateWithoutProjectInput, DeliverableUncheckedUpdateWithoutProjectInput>
  }

  export type DeliverableUpdateManyWithWhereWithoutProjectInput = {
    where: DeliverableScalarWhereInput
    data: XOR<DeliverableUpdateManyMutationInput, DeliverableUncheckedUpdateManyWithoutProjectInput>
  }

  export type DeliverableScalarWhereInput = {
    AND?: DeliverableScalarWhereInput | DeliverableScalarWhereInput[]
    OR?: DeliverableScalarWhereInput[]
    NOT?: DeliverableScalarWhereInput | DeliverableScalarWhereInput[]
    id?: StringFilter<"Deliverable"> | string
    project_id?: StringFilter<"Deliverable"> | string
    text?: StringFilter<"Deliverable"> | string
    order?: IntFilter<"Deliverable"> | number
  }

  export type ProjectsCreateWithoutDeliverablesInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    learningPhases?: LearningPhaseCreateNestedManyWithoutProjectInput
    userProjects?: UserProjectsCreateNestedManyWithoutProjectsInput
  }

  export type ProjectsUncheckedCreateWithoutDeliverablesInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    learningPhases?: LearningPhaseUncheckedCreateNestedManyWithoutProjectInput
    userProjects?: UserProjectsUncheckedCreateNestedManyWithoutProjectsInput
  }

  export type ProjectsCreateOrConnectWithoutDeliverablesInput = {
    where: ProjectsWhereUniqueInput
    create: XOR<ProjectsCreateWithoutDeliverablesInput, ProjectsUncheckedCreateWithoutDeliverablesInput>
  }

  export type ProjectsUpsertWithoutDeliverablesInput = {
    update: XOR<ProjectsUpdateWithoutDeliverablesInput, ProjectsUncheckedUpdateWithoutDeliverablesInput>
    create: XOR<ProjectsCreateWithoutDeliverablesInput, ProjectsUncheckedCreateWithoutDeliverablesInput>
    where?: ProjectsWhereInput
  }

  export type ProjectsUpdateToOneWithWhereWithoutDeliverablesInput = {
    where?: ProjectsWhereInput
    data: XOR<ProjectsUpdateWithoutDeliverablesInput, ProjectsUncheckedUpdateWithoutDeliverablesInput>
  }

  export type ProjectsUpdateWithoutDeliverablesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningPhases?: LearningPhaseUpdateManyWithoutProjectNestedInput
    userProjects?: UserProjectsUpdateManyWithoutProjectsNestedInput
  }

  export type ProjectsUncheckedUpdateWithoutDeliverablesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningPhases?: LearningPhaseUncheckedUpdateManyWithoutProjectNestedInput
    userProjects?: UserProjectsUncheckedUpdateManyWithoutProjectsNestedInput
  }

  export type UserCreateWithoutEntranceTestAttemptInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
    userProjects?: UserProjectsCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEntranceTestAttemptInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
    userProjects?: UserProjectsUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEntranceTestAttemptInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEntranceTestAttemptInput, UserUncheckedCreateWithoutEntranceTestAttemptInput>
  }

  export type UserUpsertWithoutEntranceTestAttemptInput = {
    update: XOR<UserUpdateWithoutEntranceTestAttemptInput, UserUncheckedUpdateWithoutEntranceTestAttemptInput>
    create: XOR<UserCreateWithoutEntranceTestAttemptInput, UserUncheckedCreateWithoutEntranceTestAttemptInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEntranceTestAttemptInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEntranceTestAttemptInput, UserUncheckedUpdateWithoutEntranceTestAttemptInput>
  }

  export type UserUpdateWithoutEntranceTestAttemptInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProjects?: UserProjectsUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEntranceTestAttemptInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProjects?: UserProjectsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserProjectsCreateWithoutProjectFilesInput = {
    id?: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
    user: UserCreateNestedOneWithoutUserProjectsInput
    projects: ProjectsCreateNestedOneWithoutUserProjectsInput
  }

  export type UserProjectsUncheckedCreateWithoutProjectFilesInput = {
    id?: string
    project_id: string
    user_email: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
  }

  export type UserProjectsCreateOrConnectWithoutProjectFilesInput = {
    where: UserProjectsWhereUniqueInput
    create: XOR<UserProjectsCreateWithoutProjectFilesInput, UserProjectsUncheckedCreateWithoutProjectFilesInput>
  }

  export type UserProjectsUpsertWithoutProjectFilesInput = {
    update: XOR<UserProjectsUpdateWithoutProjectFilesInput, UserProjectsUncheckedUpdateWithoutProjectFilesInput>
    create: XOR<UserProjectsCreateWithoutProjectFilesInput, UserProjectsUncheckedCreateWithoutProjectFilesInput>
    where?: UserProjectsWhereInput
  }

  export type UserProjectsUpdateToOneWithWhereWithoutProjectFilesInput = {
    where?: UserProjectsWhereInput
    data: XOR<UserProjectsUpdateWithoutProjectFilesInput, UserProjectsUncheckedUpdateWithoutProjectFilesInput>
  }

  export type UserProjectsUpdateWithoutProjectFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    user?: UserUpdateOneRequiredWithoutUserProjectsNestedInput
    projects?: ProjectsUpdateOneRequiredWithoutUserProjectsNestedInput
  }

  export type UserProjectsUncheckedUpdateWithoutProjectFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserCreateWithoutUserProjectsInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
    entranceTestAttempt?: EntranceTestAttemptCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserProjectsInput = {
    uid: string
    email: string
    skillLevel?: $Enums.Skill_Level | null
    learningModes?: UserCreatelearningModesInput | string[]
    hoursPerWeek?: number | null
    name?: string | null
    createdAt?: Date | string
    entranceTestAttempt?: EntranceTestAttemptUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserProjectsInput, UserUncheckedCreateWithoutUserProjectsInput>
  }

  export type ProjectsCreateWithoutUserProjectsInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    learningPhases?: LearningPhaseCreateNestedManyWithoutProjectInput
    deliverables?: DeliverableCreateNestedManyWithoutProjectInput
  }

  export type ProjectsUncheckedCreateWithoutUserProjectsInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    learningPhases?: LearningPhaseUncheckedCreateNestedManyWithoutProjectInput
    deliverables?: DeliverableUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectsCreateOrConnectWithoutUserProjectsInput = {
    where: ProjectsWhereUniqueInput
    create: XOR<ProjectsCreateWithoutUserProjectsInput, ProjectsUncheckedCreateWithoutUserProjectsInput>
  }

  export type ProjectFileCreateWithoutUserProjectInput = {
    id?: string
    file_path: string
    content?: string
    is_directory?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectFileUncheckedCreateWithoutUserProjectInput = {
    id?: string
    file_path: string
    content?: string
    is_directory?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectFileCreateOrConnectWithoutUserProjectInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutUserProjectInput, ProjectFileUncheckedCreateWithoutUserProjectInput>
  }

  export type ProjectFileCreateManyUserProjectInputEnvelope = {
    data: ProjectFileCreateManyUserProjectInput | ProjectFileCreateManyUserProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutUserProjectsInput = {
    update: XOR<UserUpdateWithoutUserProjectsInput, UserUncheckedUpdateWithoutUserProjectsInput>
    create: XOR<UserCreateWithoutUserProjectsInput, UserUncheckedCreateWithoutUserProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserProjectsInput, UserUncheckedUpdateWithoutUserProjectsInput>
  }

  export type UserUpdateWithoutUserProjectsInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entranceTestAttempt?: EntranceTestAttemptUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserProjectsInput = {
    uid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    skillLevel?: NullableEnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level | null
    learningModes?: UserUpdatelearningModesInput | string[]
    hoursPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entranceTestAttempt?: EntranceTestAttemptUncheckedUpdateOneWithoutUserNestedInput
  }

  export type ProjectsUpsertWithoutUserProjectsInput = {
    update: XOR<ProjectsUpdateWithoutUserProjectsInput, ProjectsUncheckedUpdateWithoutUserProjectsInput>
    create: XOR<ProjectsCreateWithoutUserProjectsInput, ProjectsUncheckedCreateWithoutUserProjectsInput>
    where?: ProjectsWhereInput
  }

  export type ProjectsUpdateToOneWithWhereWithoutUserProjectsInput = {
    where?: ProjectsWhereInput
    data: XOR<ProjectsUpdateWithoutUserProjectsInput, ProjectsUncheckedUpdateWithoutUserProjectsInput>
  }

  export type ProjectsUpdateWithoutUserProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningPhases?: LearningPhaseUpdateManyWithoutProjectNestedInput
    deliverables?: DeliverableUpdateManyWithoutProjectNestedInput
  }

  export type ProjectsUncheckedUpdateWithoutUserProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    learningPhases?: LearningPhaseUncheckedUpdateManyWithoutProjectNestedInput
    deliverables?: DeliverableUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutUserProjectInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutUserProjectInput, ProjectFileUncheckedUpdateWithoutUserProjectInput>
    create: XOR<ProjectFileCreateWithoutUserProjectInput, ProjectFileUncheckedCreateWithoutUserProjectInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutUserProjectInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutUserProjectInput, ProjectFileUncheckedUpdateWithoutUserProjectInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutUserProjectInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutUserProjectInput>
  }

  export type ProjectFileScalarWhereInput = {
    AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    OR?: ProjectFileScalarWhereInput[]
    NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    project_id?: StringFilter<"ProjectFile"> | string
    user_email?: StringFilter<"ProjectFile"> | string
    file_path?: StringFilter<"ProjectFile"> | string
    content?: StringFilter<"ProjectFile"> | string
    is_directory?: BoolFilter<"ProjectFile"> | boolean
    created_at?: DateTimeFilter<"ProjectFile"> | Date | string
    updated_at?: DateTimeFilter<"ProjectFile"> | Date | string
  }

  export type ProjectsCreateWithoutLearningPhasesInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    userProjects?: UserProjectsCreateNestedManyWithoutProjectsInput
    deliverables?: DeliverableCreateNestedManyWithoutProjectInput
  }

  export type ProjectsUncheckedCreateWithoutLearningPhasesInput = {
    id?: string
    name: string
    tech_stack?: ProjectsCreatetech_stackInput | string[]
    skill_level: $Enums.Skill_Level
    goal: string
    demo_url?: string | null
    estimated_minutes: number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    userProjects?: UserProjectsUncheckedCreateNestedManyWithoutProjectsInput
    deliverables?: DeliverableUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectsCreateOrConnectWithoutLearningPhasesInput = {
    where: ProjectsWhereUniqueInput
    create: XOR<ProjectsCreateWithoutLearningPhasesInput, ProjectsUncheckedCreateWithoutLearningPhasesInput>
  }

  export type ResourcesCreateWithoutLearningPhaseInput = {
    id?: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
    userProgress?: ResourceProgressCreateNestedManyWithoutResourceInput
  }

  export type ResourcesUncheckedCreateWithoutLearningPhaseInput = {
    id?: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
    userProgress?: ResourceProgressUncheckedCreateNestedManyWithoutResourceInput
  }

  export type ResourcesCreateOrConnectWithoutLearningPhaseInput = {
    where: ResourcesWhereUniqueInput
    create: XOR<ResourcesCreateWithoutLearningPhaseInput, ResourcesUncheckedCreateWithoutLearningPhaseInput>
  }

  export type ResourcesCreateManyLearningPhaseInputEnvelope = {
    data: ResourcesCreateManyLearningPhaseInput | ResourcesCreateManyLearningPhaseInput[]
    skipDuplicates?: boolean
  }

  export type KnowledgeChecksCreateWithoutLearningPhaseInput = {
    id?: string
    question: string
    correct_answer?: string | null
    explanation: string
    question_type: $Enums.Question_Type
  }

  export type KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput = {
    id?: string
    question: string
    correct_answer?: string | null
    explanation: string
    question_type: $Enums.Question_Type
  }

  export type KnowledgeChecksCreateOrConnectWithoutLearningPhaseInput = {
    where: KnowledgeChecksWhereUniqueInput
    create: XOR<KnowledgeChecksCreateWithoutLearningPhaseInput, KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput>
  }

  export type KnowledgeChecksCreateManyLearningPhaseInputEnvelope = {
    data: KnowledgeChecksCreateManyLearningPhaseInput | KnowledgeChecksCreateManyLearningPhaseInput[]
    skipDuplicates?: boolean
  }

  export type ProjectsUpsertWithoutLearningPhasesInput = {
    update: XOR<ProjectsUpdateWithoutLearningPhasesInput, ProjectsUncheckedUpdateWithoutLearningPhasesInput>
    create: XOR<ProjectsCreateWithoutLearningPhasesInput, ProjectsUncheckedCreateWithoutLearningPhasesInput>
    where?: ProjectsWhereInput
  }

  export type ProjectsUpdateToOneWithWhereWithoutLearningPhasesInput = {
    where?: ProjectsWhereInput
    data: XOR<ProjectsUpdateWithoutLearningPhasesInput, ProjectsUncheckedUpdateWithoutLearningPhasesInput>
  }

  export type ProjectsUpdateWithoutLearningPhasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProjects?: UserProjectsUpdateManyWithoutProjectsNestedInput
    deliverables?: DeliverableUpdateManyWithoutProjectNestedInput
  }

  export type ProjectsUncheckedUpdateWithoutLearningPhasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tech_stack?: ProjectsUpdatetech_stackInput | string[]
    skill_level?: EnumSkill_LevelFieldUpdateOperationsInput | $Enums.Skill_Level
    goal?: StringFieldUpdateOperationsInput | string
    demo_url?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    initial_files?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userProjects?: UserProjectsUncheckedUpdateManyWithoutProjectsNestedInput
    deliverables?: DeliverableUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ResourcesUpsertWithWhereUniqueWithoutLearningPhaseInput = {
    where: ResourcesWhereUniqueInput
    update: XOR<ResourcesUpdateWithoutLearningPhaseInput, ResourcesUncheckedUpdateWithoutLearningPhaseInput>
    create: XOR<ResourcesCreateWithoutLearningPhaseInput, ResourcesUncheckedCreateWithoutLearningPhaseInput>
  }

  export type ResourcesUpdateWithWhereUniqueWithoutLearningPhaseInput = {
    where: ResourcesWhereUniqueInput
    data: XOR<ResourcesUpdateWithoutLearningPhaseInput, ResourcesUncheckedUpdateWithoutLearningPhaseInput>
  }

  export type ResourcesUpdateManyWithWhereWithoutLearningPhaseInput = {
    where: ResourcesScalarWhereInput
    data: XOR<ResourcesUpdateManyMutationInput, ResourcesUncheckedUpdateManyWithoutLearningPhaseInput>
  }

  export type ResourcesScalarWhereInput = {
    AND?: ResourcesScalarWhereInput | ResourcesScalarWhereInput[]
    OR?: ResourcesScalarWhereInput[]
    NOT?: ResourcesScalarWhereInput | ResourcesScalarWhereInput[]
    id?: StringFilter<"Resources"> | string
    phase_id?: StringFilter<"Resources"> | string
    type?: StringFilter<"Resources"> | string
    title?: StringFilter<"Resources"> | string
    url?: StringFilter<"Resources"> | string
    duration_minutes?: IntFilter<"Resources"> | number
    provider?: StringFilter<"Resources"> | string
    timestamps?: JsonNullableFilter<"Resources">
    quality_score?: FloatFilter<"Resources"> | number
  }

  export type KnowledgeChecksUpsertWithWhereUniqueWithoutLearningPhaseInput = {
    where: KnowledgeChecksWhereUniqueInput
    update: XOR<KnowledgeChecksUpdateWithoutLearningPhaseInput, KnowledgeChecksUncheckedUpdateWithoutLearningPhaseInput>
    create: XOR<KnowledgeChecksCreateWithoutLearningPhaseInput, KnowledgeChecksUncheckedCreateWithoutLearningPhaseInput>
  }

  export type KnowledgeChecksUpdateWithWhereUniqueWithoutLearningPhaseInput = {
    where: KnowledgeChecksWhereUniqueInput
    data: XOR<KnowledgeChecksUpdateWithoutLearningPhaseInput, KnowledgeChecksUncheckedUpdateWithoutLearningPhaseInput>
  }

  export type KnowledgeChecksUpdateManyWithWhereWithoutLearningPhaseInput = {
    where: KnowledgeChecksScalarWhereInput
    data: XOR<KnowledgeChecksUpdateManyMutationInput, KnowledgeChecksUncheckedUpdateManyWithoutLearningPhaseInput>
  }

  export type KnowledgeChecksScalarWhereInput = {
    AND?: KnowledgeChecksScalarWhereInput | KnowledgeChecksScalarWhereInput[]
    OR?: KnowledgeChecksScalarWhereInput[]
    NOT?: KnowledgeChecksScalarWhereInput | KnowledgeChecksScalarWhereInput[]
    id?: StringFilter<"KnowledgeChecks"> | string
    phase_id?: StringFilter<"KnowledgeChecks"> | string
    question?: StringFilter<"KnowledgeChecks"> | string
    correct_answer?: StringNullableFilter<"KnowledgeChecks"> | string | null
    explanation?: StringFilter<"KnowledgeChecks"> | string
    question_type?: EnumQuestion_TypeFilter<"KnowledgeChecks"> | $Enums.Question_Type
  }

  export type LearningPhaseCreateWithoutKnowledgeChecksInput = {
    id?: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    project: ProjectsCreateNestedOneWithoutLearningPhasesInput
    resources?: ResourcesCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseUncheckedCreateWithoutKnowledgeChecksInput = {
    id?: string
    project_id: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    resources?: ResourcesUncheckedCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseCreateOrConnectWithoutKnowledgeChecksInput = {
    where: LearningPhaseWhereUniqueInput
    create: XOR<LearningPhaseCreateWithoutKnowledgeChecksInput, LearningPhaseUncheckedCreateWithoutKnowledgeChecksInput>
  }

  export type LearningPhaseUpsertWithoutKnowledgeChecksInput = {
    update: XOR<LearningPhaseUpdateWithoutKnowledgeChecksInput, LearningPhaseUncheckedUpdateWithoutKnowledgeChecksInput>
    create: XOR<LearningPhaseCreateWithoutKnowledgeChecksInput, LearningPhaseUncheckedCreateWithoutKnowledgeChecksInput>
    where?: LearningPhaseWhereInput
  }

  export type LearningPhaseUpdateToOneWithWhereWithoutKnowledgeChecksInput = {
    where?: LearningPhaseWhereInput
    data: XOR<LearningPhaseUpdateWithoutKnowledgeChecksInput, LearningPhaseUncheckedUpdateWithoutKnowledgeChecksInput>
  }

  export type LearningPhaseUpdateWithoutKnowledgeChecksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectsUpdateOneRequiredWithoutLearningPhasesNestedInput
    resources?: ResourcesUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseUncheckedUpdateWithoutKnowledgeChecksInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resources?: ResourcesUncheckedUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseCreateWithoutResourcesInput = {
    id?: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    project: ProjectsCreateNestedOneWithoutLearningPhasesInput
    knowledgeChecks?: KnowledgeChecksCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseUncheckedCreateWithoutResourcesInput = {
    id?: string
    project_id: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
    knowledgeChecks?: KnowledgeChecksUncheckedCreateNestedManyWithoutLearningPhaseInput
  }

  export type LearningPhaseCreateOrConnectWithoutResourcesInput = {
    where: LearningPhaseWhereUniqueInput
    create: XOR<LearningPhaseCreateWithoutResourcesInput, LearningPhaseUncheckedCreateWithoutResourcesInput>
  }

  export type ResourceProgressCreateWithoutResourceInput = {
    id?: string
    user_email: string
    project_id: string
    completed?: boolean
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResourceProgressUncheckedCreateWithoutResourceInput = {
    id?: string
    user_email: string
    project_id: string
    completed?: boolean
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResourceProgressCreateOrConnectWithoutResourceInput = {
    where: ResourceProgressWhereUniqueInput
    create: XOR<ResourceProgressCreateWithoutResourceInput, ResourceProgressUncheckedCreateWithoutResourceInput>
  }

  export type ResourceProgressCreateManyResourceInputEnvelope = {
    data: ResourceProgressCreateManyResourceInput | ResourceProgressCreateManyResourceInput[]
    skipDuplicates?: boolean
  }

  export type LearningPhaseUpsertWithoutResourcesInput = {
    update: XOR<LearningPhaseUpdateWithoutResourcesInput, LearningPhaseUncheckedUpdateWithoutResourcesInput>
    create: XOR<LearningPhaseCreateWithoutResourcesInput, LearningPhaseUncheckedCreateWithoutResourcesInput>
    where?: LearningPhaseWhereInput
  }

  export type LearningPhaseUpdateToOneWithWhereWithoutResourcesInput = {
    where?: LearningPhaseWhereInput
    data: XOR<LearningPhaseUpdateWithoutResourcesInput, LearningPhaseUncheckedUpdateWithoutResourcesInput>
  }

  export type LearningPhaseUpdateWithoutResourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectsUpdateOneRequiredWithoutLearningPhasesNestedInput
    knowledgeChecks?: KnowledgeChecksUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseUncheckedUpdateWithoutResourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    knowledgeChecks?: KnowledgeChecksUncheckedUpdateManyWithoutLearningPhaseNestedInput
  }

  export type ResourceProgressUpsertWithWhereUniqueWithoutResourceInput = {
    where: ResourceProgressWhereUniqueInput
    update: XOR<ResourceProgressUpdateWithoutResourceInput, ResourceProgressUncheckedUpdateWithoutResourceInput>
    create: XOR<ResourceProgressCreateWithoutResourceInput, ResourceProgressUncheckedCreateWithoutResourceInput>
  }

  export type ResourceProgressUpdateWithWhereUniqueWithoutResourceInput = {
    where: ResourceProgressWhereUniqueInput
    data: XOR<ResourceProgressUpdateWithoutResourceInput, ResourceProgressUncheckedUpdateWithoutResourceInput>
  }

  export type ResourceProgressUpdateManyWithWhereWithoutResourceInput = {
    where: ResourceProgressScalarWhereInput
    data: XOR<ResourceProgressUpdateManyMutationInput, ResourceProgressUncheckedUpdateManyWithoutResourceInput>
  }

  export type ResourceProgressScalarWhereInput = {
    AND?: ResourceProgressScalarWhereInput | ResourceProgressScalarWhereInput[]
    OR?: ResourceProgressScalarWhereInput[]
    NOT?: ResourceProgressScalarWhereInput | ResourceProgressScalarWhereInput[]
    id?: StringFilter<"ResourceProgress"> | string
    resource_id?: StringFilter<"ResourceProgress"> | string
    user_email?: StringFilter<"ResourceProgress"> | string
    project_id?: StringFilter<"ResourceProgress"> | string
    completed?: BoolFilter<"ResourceProgress"> | boolean
    completed_at?: DateTimeNullableFilter<"ResourceProgress"> | Date | string | null
    created_at?: DateTimeFilter<"ResourceProgress"> | Date | string
    updated_at?: DateTimeFilter<"ResourceProgress"> | Date | string
  }

  export type ResourcesCreateWithoutUserProgressInput = {
    id?: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
    learningPhase: LearningPhaseCreateNestedOneWithoutResourcesInput
  }

  export type ResourcesUncheckedCreateWithoutUserProgressInput = {
    id?: string
    phase_id: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
  }

  export type ResourcesCreateOrConnectWithoutUserProgressInput = {
    where: ResourcesWhereUniqueInput
    create: XOR<ResourcesCreateWithoutUserProgressInput, ResourcesUncheckedCreateWithoutUserProgressInput>
  }

  export type ResourcesUpsertWithoutUserProgressInput = {
    update: XOR<ResourcesUpdateWithoutUserProgressInput, ResourcesUncheckedUpdateWithoutUserProgressInput>
    create: XOR<ResourcesCreateWithoutUserProgressInput, ResourcesUncheckedCreateWithoutUserProgressInput>
    where?: ResourcesWhereInput
  }

  export type ResourcesUpdateToOneWithWhereWithoutUserProgressInput = {
    where?: ResourcesWhereInput
    data: XOR<ResourcesUpdateWithoutUserProgressInput, ResourcesUncheckedUpdateWithoutUserProgressInput>
  }

  export type ResourcesUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
    learningPhase?: LearningPhaseUpdateOneRequiredWithoutResourcesNestedInput
  }

  export type ResourcesUncheckedUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    phase_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
  }

  export type UserProjectsCreateManyUserInput = {
    id?: string
    project_id: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
  }

  export type UserProjectsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    projects?: ProjectsUpdateOneRequiredWithoutUserProjectsNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutUserProjectNestedInput
  }

  export type UserProjectsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutUserProjectNestedInput
  }

  export type UserProjectsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type LearningPhaseCreateManyProjectInput = {
    id?: string
    title: string
    description: string
    long_description?: string
    concepts?: LearningPhaseCreateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number: number
    phase_status?: $Enums.PhaseStatus
    estimated_minutes: number
    createdAt?: Date | string
  }

  export type UserProjectsCreateManyProjectsInput = {
    id?: string
    user_email: string
    status?: $Enums.Status
    current_phase?: number
    started_at?: Date | string
    completed_at?: Date | string | null
    archived?: boolean | null
  }

  export type DeliverableCreateManyProjectInput = {
    id?: string
    text: string
    order: number
  }

  export type LearningPhaseUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resources?: ResourcesUpdateManyWithoutLearningPhaseNestedInput
    knowledgeChecks?: KnowledgeChecksUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resources?: ResourcesUncheckedUpdateManyWithoutLearningPhaseNestedInput
    knowledgeChecks?: KnowledgeChecksUncheckedUpdateManyWithoutLearningPhaseNestedInput
  }

  export type LearningPhaseUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    long_description?: StringFieldUpdateOperationsInput | string
    concepts?: LearningPhaseUpdateconceptsInput | string[]
    goal?: NullableJsonNullValueInput | InputJsonValue
    phase_number?: IntFieldUpdateOperationsInput | number
    phase_status?: EnumPhaseStatusFieldUpdateOperationsInput | $Enums.PhaseStatus
    estimated_minutes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProjectsUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    user?: UserUpdateOneRequiredWithoutUserProjectsNestedInput
    projectFiles?: ProjectFileUpdateManyWithoutUserProjectNestedInput
  }

  export type UserProjectsUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
    projectFiles?: ProjectFileUncheckedUpdateManyWithoutUserProjectNestedInput
  }

  export type UserProjectsUncheckedUpdateManyWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    current_phase?: IntFieldUpdateOperationsInput | number
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archived?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type DeliverableUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliverableUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliverableUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectFileCreateManyUserProjectInput = {
    id?: string
    file_path: string
    content?: string
    is_directory?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProjectFileUpdateWithoutUserProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateWithoutUserProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyWithoutUserProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    is_directory?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourcesCreateManyLearningPhaseInput = {
    id?: string
    type: string
    title: string
    url: string
    duration_minutes: number
    provider: string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score: number
  }

  export type KnowledgeChecksCreateManyLearningPhaseInput = {
    id?: string
    question: string
    correct_answer?: string | null
    explanation: string
    question_type: $Enums.Question_Type
  }

  export type ResourcesUpdateWithoutLearningPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
    userProgress?: ResourceProgressUpdateManyWithoutResourceNestedInput
  }

  export type ResourcesUncheckedUpdateWithoutLearningPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
    userProgress?: ResourceProgressUncheckedUpdateManyWithoutResourceNestedInput
  }

  export type ResourcesUncheckedUpdateManyWithoutLearningPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    duration_minutes?: IntFieldUpdateOperationsInput | number
    provider?: StringFieldUpdateOperationsInput | string
    timestamps?: NullableJsonNullValueInput | InputJsonValue
    quality_score?: FloatFieldUpdateOperationsInput | number
  }

  export type KnowledgeChecksUpdateWithoutLearningPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
  }

  export type KnowledgeChecksUncheckedUpdateWithoutLearningPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
  }

  export type KnowledgeChecksUncheckedUpdateManyWithoutLearningPhaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    correct_answer?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: StringFieldUpdateOperationsInput | string
    question_type?: EnumQuestion_TypeFieldUpdateOperationsInput | $Enums.Question_Type
  }

  export type ResourceProgressCreateManyResourceInput = {
    id?: string
    user_email: string
    project_id: string
    completed?: boolean
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ResourceProgressUpdateWithoutResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceProgressUncheckedUpdateWithoutResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResourceProgressUncheckedUpdateManyWithoutResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_email?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
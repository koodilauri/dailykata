import { boolean, date, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard'])

export const kata = pgTable('kata', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  starterCode: text('starter_code').notNull(),
  tests: text('tests').notNull(),
  hints: text('hints').array(),
  difficulty: difficultyEnum('difficulty').notNull().default('easy'),
  order: integer('order').notNull(),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const submission = pgTable('submission', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  kataId: text('kata_id')
    .notNull()
    .references(() => kata.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  passed: boolean('passed').notNull(),
  submittedAt: timestamp('submitted_at').notNull().defaultNow()
})

export const userProgress = pgTable('user_progress', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  kataId: text('kata_id')
    .notNull()
    .references(() => kata.id, { onDelete: 'cascade' }),
  completed: boolean('completed').notNull().default(false),
  xpEarned: integer('xp_earned').notNull().default(0),
  lastAttemptAt: timestamp('last_attempt_at').notNull().defaultNow()
})

export const userStats = pgTable('user_stats', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id),
  totalXp: integer('total_xp').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActivityDate: date('last_activity_date')
})

export const xpEvent = pgTable('xp_event', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(), // 'kata_complete' | 'daily_bonus' | 'streak_milestone'
  createdAt: timestamp('created_at').notNull().defaultNow()
})

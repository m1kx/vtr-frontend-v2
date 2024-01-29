/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Notifications = "notifications",
	Times = "times",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type NotificationsRecord = {
	send?: boolean
}

export type TimesRecord = {
	day_1?: string
	day_2?: string
}

export type UsersRecord<Treqinfo = unknown> = {
	class: string
	h_hash?: string
	h_score?: number
	m_hash?: string
	new_update?: boolean
	new_version?: boolean
	notifications?: string
	reqinfo?: null | Treqinfo
	score?: number
	subjects: string
}

// Response types include system fields and match responses from the PocketBase API
export type NotificationsResponse<Texpand = unknown> = Required<NotificationsRecord> & BaseSystemFields<Texpand>
export type TimesResponse<Texpand = unknown> = Required<TimesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Treqinfo = unknown, Texpand = unknown> = Required<UsersRecord<Treqinfo>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	notifications: NotificationsRecord
	times: TimesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	notifications: NotificationsResponse
	times: TimesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'notifications'): RecordService<NotificationsResponse>
	collection(idOrName: 'times'): RecordService<TimesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}

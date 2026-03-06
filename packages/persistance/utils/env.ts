
const { DATABASE_URL, MIGRATOR_URL } = process.env

if (!DATABASE_URL) throw new Error('No database URL provided')
if (!MIGRATOR_URL) throw new Error('No migrator URL provided')

export default {
    dbUrl: DATABASE_URL,
    migrateUrl: MIGRATOR_URL,
}
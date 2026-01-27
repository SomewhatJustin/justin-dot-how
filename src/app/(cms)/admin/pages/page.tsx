import { db, schema } from "@/lib/db"
import Link from "next/link"
import { format } from "date-fns"

export default async function PagesPage() {
  const pages = await db.select().from(schema.pages)

  return (
    <div>
      <div>
        <h1>pages</h1>
        <p>edit static pages</p>
      </div>

      <table className="admin-table" style={{ marginTop: "1.5rem" }}>
        <thead>
          <tr>
            <th>title</th>
            <th>slug</th>
            <th>updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td>{page.title}</td>
              <td>/{page.slug}</td>
              <td>{format(page.updatedAt, "yyyy-MM-dd")}</td>
              <td>
                <Link href={`/admin/pages/${page.id}`}>[edit]</Link>
              </td>
            </tr>
          ))}
          {pages.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                no pages found. run migration script to import.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

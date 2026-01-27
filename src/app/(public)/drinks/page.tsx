import type { Metadata } from "next"
import "./drinks.css"

export const metadata: Metadata = {
  title: "PowerPoint Night Drink Menu",
  description: "justin make drinky",
}

export default function DrinksPage() {
  return (
    <div className="powerpoint-slide">
      <div className="slide-header">
        <h1 className="title-text">justin make drinky</h1>
      </div>

      <div className="content-box">
        <h2 className="subtitle">Fancy Cocktails</h2>
        <ul className="bullet-list">
          <li className="list-item">
            <h3 className="item-title">Mojito</h3>
            <p className="item-description">
              Rum, mint, and lime for the most part. I love making these tbh
            </p>
            <div className="clipart">🌿</div>
          </li>
          <li className="list-item">
            <h3 className="item-title">Classic Mojito</h3>
            <p className="item-description">
              When your friend, Mojito, says something funny.
            </p>
            <div className="clipart">😂</div>
          </li>
          <li className="list-item">
            <h3 className="item-title">Old Fashioned</h3>
            <p className="item-description">ahha just kidding it&apos;s a mojito</p>
            <div className="clipart">🤪</div>
          </li>
          <li className="list-item">
            <h3 className="item-title">Gin and Soda</h3>
            <p className="item-description">
              sometimes referred to as &quot;gay water&quot;(?). idk ask jane!
            </p>
            <div className="clipart">🏳️‍🌈</div>
          </li>
        </ul>
      </div>

      <div className="content-box">
        <h2 className="subtitle">&quot;Full&quot; Bar</h2>
        <p className="item-description">we got the goods:</p>
        <ul className="bullet-list">
          <li className="list-item">
            <h3 className="item-title">Booze</h3>
            <p className="item-description">rum, gin</p>
          </li>
          <li className="list-item">
            <h3 className="item-title">Mixers</h3>
            <p className="item-description">
              cranberry juice (lmao u got a UTI?), club soda (a club classic), diet coke (plz I want
              to get rid of these), lemon-flavored seltzer (meh)
            </p>
          </li>
        </ul>
        <p className="item-description">mix n&apos; match for a wild ride! 🎢</p>
        <div className="clipart">🍹</div>
      </div>

      <div className="content-box">
        <h2 className="subtitle">Sober bevvies</h2>
        <p className="boring-text">i got water</p>
        <div className="clipart">💧</div>
      </div>

      <div className="footer">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(() => {
          const Marquee = "marquee" as any
          return (
            <Marquee className="scrolling-text">
              🎉 i am happy that you are here plz enjoy 🎉
            </Marquee>
          )
        })()}
      </div>
    </div>
  )
}

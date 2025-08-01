from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from datetime import datetime
import re

def parse_date_time(raw_str):
    try:
        dt = datetime.strptime(raw_str.strip(), "%d/%m, %H:%M")
        dt = dt.replace(year=datetime.now().year)
        return dt.isoformat()
    except Exception as e:
        print("⚠️ Failed to parse date:", raw_str)
        return datetime.now().isoformat()

def scrape_and_generate_js():
    url = "https://www.betika.com/en-ke/jackpots/midweekjp"
    

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=60000)
        page.wait_for_timeout(5000)
        html = page.content()
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    tables = soup.select(".jackpot-event__match")

    matches = []

    for table in tables:
        try:
            datetime_str = table.select_one("td.jackpot-event__match__details span[style*='float: right']").get_text(strip=True)
            date_to_play = parse_date_time(datetime_str)

            teams = table.select(".jackpot-event__match__teams__item")
            if len(teams) < 2:
                continue

            home_team = teams[0].text.strip()
            away_team = teams[1].text.strip()

            odds = table.select(".jackpot-event__match__odd__value")
            if len(odds) < 3:
                continue

            home_odds = float(odds[0].text.strip())
            draw_odds = float(odds[1].text.strip())
            away_odds = float(odds[2].text.strip())

            matches.append({
                "date_to_play": date_to_play,
                "home_team": home_team,
                "away_team": away_team,
                "home_odds": home_odds,
                "draw_odds": draw_odds,
                "away_odds": away_odds
            })

        except Exception as e:
            print("❌ Error parsing match:", e)

    # Write to a .js file
    with open("jackpot_games.js", "w", encoding="utf-8") as f:
        f.write("const todayMatches = [\n")
        for m in matches:
            f.write("  {\n")
            f.write(f"    date_to_play: '{m['date_to_play']}',\n")
            f.write(f"    home_team: '{m['home_team']}',\n")
            f.write(f"    away_team: '{m['away_team']}',\n")
            f.write(f"    home_odds: {m['home_odds']},\n")
            f.write(f"    draw_odds: {m['draw_odds']},\n")
            f.write(f"    away_odds: {m['away_odds']},\n")
            f.write("  },\n")
        f.write("];\n")
        f.write("\n")
        f.write("export default todayMatches\n")

    print(f"✅ Jackpot data written to jackpot_games.js ({len(matches)} matches)")

if __name__ == "__main__":
    scrape_and_generate_js()

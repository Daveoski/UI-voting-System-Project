localStorage.clear();

type Candidate = "Lilian" | "Austin" | "Kosi" | "David";

const CANDIDATES: readonly Candidate[] = ["Lilian", "Austin", "Kosi", "David"];

function fail(message: string): never {
    throw new Error(message);
}

function getElement<T extends HTMLElement>(id: string): T {

    return (document.getElementById(id) as T | null)
        ?? fail(`Missing element in the page: #${id}`);

}

const votes = new Map<Candidate, number>(
    CANDIDATES.map(name => [name, 0])
);

const voters = new Set<string>();


function voterKey(name: string): string {
    return name.trim().toLowerCase();
}

const form = getElement<HTMLFormElement>("voteForm");
const voterName = getElement<HTMLInputElement>("voterName");
const candidate = getElement<HTMLSelectElement>("candidate");
const totalVotes = getElement("totalVotes");
const tallyBoard = getElement("tallyBoard");

const winnerModal = getElement("winnerModal");
const winnerName = getElement("winnerName");
const closeModal = getElement<HTMLButtonElement>("closeModal");

const leaderboard = getElement("leaderboard");


function buildCandidateOptions(): void {

    candidate.replaceChildren(
        new Option("Select Candidate", "", true, true),
        ...CANDIDATES.map(name => new Option(name, name))
    );

}

const tallyCells = new Map<Candidate, HTMLSpanElement>();

function buildTallyBoard(): void {

    tallyBoard.replaceChildren(
        ...CANDIDATES.map(name => {

            const count = document.createElement("span");
            count.textContent = "0";

            const row = document.createElement("p");
            row.append(`${name} : `, count);

            tallyCells.set(name, count);

            return row;

        })
    );

}

form.addEventListener("submit", function (e: SubmitEvent): void {

    e.preventDefault();

    const chosen = candidate.value as Candidate;

    voters.add(voterKey(voterName.value));

    votes.set(chosen, (votes.get(chosen) ?? 0) + 1);

    updateVoteCount();

    showWinner();

    form.reset();

    voterName.setCustomValidity("");

});


voterName.addEventListener("input", function (): void {

    voterName.setCustomValidity(
        voters.has(voterKey(voterName.value)) ? "You have already voted." : ""
    );

});

function updateVoteCount(): void {

    votes.forEach((score, name) => {

        const cell = tallyCells.get(name)
            ?? fail(`No tally cell was built for ${name}.`);

        cell.textContent = String(score);

    });

    const total = [...votes.values()].reduce((sum, score) => sum + score, 0);

    totalVotes.textContent = String(total);

    updateLeaderboard();

}

function rankedVotes(): [Candidate, number][] {

    return [...votes.entries()].sort((a, b) => b[1] - a[1]);

}

function updateLeaderboard(): void {

    leaderboard.replaceChildren(
        ...rankedVotes().map(([name, score]) => {

            const who = document.createElement("span");
            who.textContent = name;

            const points = document.createElement("span");
            points.textContent = String(score);

            const row = document.createElement("div");
            row.className = "flex justify-between bg-gray-100 p-3 rounded-lg mt-2";
            row.append(who, points);

            return row;

        })
    );

}

function showWinner(): void {

    const [winner, highest] = rankedVotes()[0]
        ?? fail("There are no candidates to rank.");

    const trophy = document.createElement("div");
    trophy.className = "text-6xl";
    trophy.textContent = "🏆";

    const heading = document.createElement("h2");
    heading.className = "text-3xl font-bold text-green-600 mt-3";
    heading.textContent = winner;

    const score = document.createElement("p");
    score.className = "text-xl mt-3";
    score.textContent = `${highest} Vote(s)`;

    winnerName.replaceChildren(trophy, heading, score);

    winnerModal.classList.remove("hidden");

}

closeModal.addEventListener("click", function (): void {

    winnerModal.classList.add("hidden");

});

buildCandidateOptions();
buildTallyBoard();
updateVoteCount();

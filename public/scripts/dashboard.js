import { Ui, apiCall, isLoggedIn, logout } from "./utils.js";

const updateDashboardUI = (user) => {
  // Update user info in sidebar
  const userNameEl = document.querySelector(".p-6 .flex .font-bold");
  const userEmailEl = document.querySelector(".p-6 .flex .text-xs");
  if (userNameEl && userEmailEl) {
    userNameEl.textContent = user.fullname;
    userEmailEl.textContent = user.email;
  }

  // Update stats
  const totalBalanceEl = document.querySelector(
    ".grid .glass-panel:nth-child(1) h3"
  );
  const totalProfitEl = document.querySelector(
    ".grid .glass-panel:nth-child(2) h3"
  );
  const activePlansEl = document.querySelector(
    ".grid .glass-panel:nth-child(3) h3"
  );

  if (totalBalanceEl)
    totalBalanceEl.textContent = `$${user.balance.toLocaleString()}`;

  // These are just placeholders, you would need to calculate total profit and active plans
  if (totalProfitEl) totalProfitEl.textContent = "$0.00";
  if (activePlansEl) activePlansEl.textContent = user.Investments.length;

  // Update active investments
  const activeInvestmentsContainer = document.querySelector(".space-y-8");
  const investmentTemplate = document.querySelector(".glass-panel.border-l-4");

  if (activeInvestmentsContainer && investmentTemplate) {
    // Preserve a clean template clone before removing existing nodes
    const preservedTemplate = investmentTemplate
      ? investmentTemplate.cloneNode(true)
      : null;

    // Clear existing investment cards inside the container
    activeInvestmentsContainer
      .querySelectorAll(".glass-panel.border-l-4")
      .forEach((el) => el.remove());

    user.Investments.forEach((investment) => {
      const investmentEl = preservedTemplate
        ? preservedTemplate.cloneNode(true)
        : document.createElement("div");

      const planNameEl = investmentEl.querySelector("h3");
      const investedAmountEl = investmentEl.querySelector("p.text-sm");
      const statusEl = investmentEl.querySelector("span.px-3");
      const startDateEl = investmentEl.querySelector(
        ".flex.justify-between span:nth-child(1)"
      );
      const maturityDateEl = investmentEl.querySelector(
        ".flex.justify-between span:nth-child(2)"
      );
      const progressBarEl = investmentEl.querySelector(
        ".h-full.bg-gradient-to-r"
      );
      const daysRemainingEl = investmentEl.querySelector("p.text-right");

      const planLabel = investment.plan || investment.planName || "Plan";
      planNameEl.textContent = `${planLabel} Plan (Active)`;
      const amountVal = Number(investment.amount) || 0;
      const roiVal = Number(investment.roi) || 0;
      investedAmountEl.textContent = `Invested: $${amountVal.toLocaleString()} | Expected ROI: ${roiVal}%`;
      statusEl.textContent = investment.status;

      const startDate = new Date(investment.startDate);
      const maturityDate = new Date(investment.maturityDate);
      const now = new Date();
      const duration = (maturityDate - startDate) / (1000 * 60 * 60 * 24);
      const elapsed = (now - startDate) / (1000 * 60 * 60 * 24);
      const progress = Math.min((elapsed / duration) * 100, 100);
      const daysRemaining = Math.max(
        Math.ceil((maturityDate - now) / (1000 * 60 * 60 * 24)),
        0
      );

      startDateEl.textContent = `Started: ${startDate.toLocaleDateString()}`;
      maturityDateEl.textContent = `Maturity: ${maturityDate.toLocaleDateString()}`;
      progressBarEl.style.width = `${progress}%`;
      daysRemainingEl.textContent = `${daysRemaining} Days Remaining`;

      if (investment.status === "completed") {
        statusEl.classList.remove(
          "bg-green-500/10",
          "text-green-400",
          "border-green-500/20"
        );
        statusEl.classList.add(
          "bg-gray-500/10",
          "text-gray-400",
          "border-gray-500/20"
        );
      }

      activeInvestmentsContainer.insertBefore(
        investmentEl,
        activeInvestmentsContainer.children[2]
      );
    });
  }

  // Update Investment History (use Investments not Transactions)
  const historyTableBody = document.querySelector(".glass-panel table tbody");
  if (historyTableBody) {
    historyTableBody.innerHTML = "";

    user.Investments.forEach((inv) => {
      const planLabel = inv.plan || inv.planName || "Plan";
      const amountVal = Number(inv.amount) || 0;
      const dateVal = inv.startDate
        ? new Date(inv.startDate)
        : new Date(inv.createdAt);
      const status = inv.status || "pending";

      // Compute profit only if matured or completed
      const matured = inv.maturityDate
        ? new Date(inv.maturityDate) <= new Date()
        : status === "completed";
      const roiVal = Number(inv.roi) || 0;
      const profitVal = matured ? (amountVal * roiVal) / 100 : null;
      const profitText =
        profitVal !== null
          ? `+$${profitVal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "";

      const statusClass =
        status === "approved" || status === "completed"
          ? "bg-green-500/10 text-green-400"
          : status === "pending"
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-red-500/10 text-red-400";

      const row = `
        <tr>
          <td class="p-4 font-medium text-white">${planLabel} Plan</td>
          <td class="p-4">$${amountVal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
          <td class="p-4">${dateVal.toLocaleDateString()}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded text-xs ${statusClass}">${status}</span>
          </td>
          <td class="p-4 text-right text-green-400">${profitText}</td>
        </tr>
      `;

      historyTableBody.innerHTML += row;
    });
  }
};

// Chart Initialization (Only runs if element exists)
export async function initDashboardCharts() {
  const { data: user, status } = await apiCall("/api/dashboard");

  if (status !== 200) {
    Ui.alert("error", "Failed to fetch data", user.message);
    if (status === 401) logout();
    return;
  }

  updateDashboardUI(user);

  const portfolioEl = document.querySelector("#portfolioChart");
  const allocationEl = document.querySelector("#assetChart");

  if (portfolioEl) {
    const options = {
      series: [
        {
          name: "Portfolio Value",
          data: [12500, 14200, 13800, 16500, 19200, 21500, user.balance],
        },
      ],
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        fontFamily: "Outfit, sans-serif",
        background: "transparent",
      },
      colors: ["#22d3ee"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#94a3b8" } },
      },
      yaxis: {
        labels: {
          style: { colors: "#94a3b8" },
          formatter: (value) => {
            return "$" + value.toLocaleString();
          },
        },
      },
      grid: {
        borderColor: "#1e293b",
        strokeDashArray: 4,
      },
      theme: { mode: "dark" },
    };
    new ApexCharts(portfolioEl, options).render();
  }

  if (allocationEl) {
    const options = {
      series: [45, 30, 15, 10],
      labels: ["Crypto", "Forex", "Stocks", "Commodities"],
      chart: {
        type: "donut",
        height: 300,
        fontFamily: "Outfit, sans-serif",
        background: "transparent",
      },
      colors: ["#22d3ee", "#3b82f6", "#818cf8", "#f472b6"],
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
            labels: {
              show: true,
              name: { color: "#94a3b8" },
              value: { color: "#fff", fontSize: "20px", fontWeight: "bold" },
              total: {
                show: true,
                label: "Total Assets",
                color: "#94a3b8",
                formatter: function (w) {
                  return "$" + user.balance.toLocaleString();
                },
              },
            },
          },
        },
      },
      stroke: { show: false },
      legend: {
        position: "bottom",
        labels: { colors: "#94a3b8" },
      },
      dataLabels: { enabled: false },
    };
    new ApexCharts(allocationEl, options).render();
  }
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  if (!isLoggedIn()) {
    window.location.href = "../login/";
    return;
  }

  initDashboardCharts();

  // Toggle Mobile Sidebar
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (sidebarToggle && sidebar && overlay) {
    function toggleSidebar() {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    }

    sidebarToggle.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);
  }

  // Notification Bell Logic
  const notificationBtn = document.getElementById("notificationBtn");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      Ui.toast("info", "No new notifications");
    });
  }

  // Logout Logic
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Ui.alert(
        "question",
        "Sign Out?",
        "Are you sure you want to log out of your account?"
      ).then((result) => {
        if (result.isConfirmed) {
          logout();
        }
      });
    });
  }

  // Purchase Plan Modal Logic
  const purchasePlanModal = document.getElementById("purchasePlanModal");
  const purchasePlanBtn = document.getElementById("purchasePlanBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const purchasePlanForm = document.getElementById("purchasePlanForm");

  if (purchasePlanBtn && purchasePlanModal && closeModalBtn) {
    purchasePlanBtn.addEventListener("click", () => {
      purchasePlanModal.classList.remove("modal-inactive");
      purchasePlanModal.classList.add("modal-active");
    });

    closeModalBtn.addEventListener("click", () => {
      purchasePlanModal.classList.add("modal-inactive");
      purchasePlanModal.classList.remove("modal-active");
    });
  }

  if (purchasePlanForm) {
    purchasePlanForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const plan = e.target.plan.value;
      const amount = e.target.amount.value;

      if (!amount || amount <= 0) {
        return Ui.toast("error", "Please enter a valid amount");
      }

      const { status, data } = await apiCall("/api/investments", "POST", {
        plan,
        amount,
      });

      if (status === 201) {
        Ui.toast("success", "Investment purchased successfully");
        purchasePlanModal.classList.add("modal-inactive");
        purchasePlanModal.classList.remove("modal-active");
        initDashboardCharts();
      } else {
        Ui.alert("error", "Purchase Failed", data.message);
      }
    });
  }
});

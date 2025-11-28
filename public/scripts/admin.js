import { Ui, apiCall, isLoggedIn, logout } from "./utils.js";

// Check if user is logged in and is an admin
if (!isLoggedIn()) {
  window.location.href = '../login/';
}

// You would typically also have a way to check if the user is an admin.
// For now, we will assume if they can access this page, they are an admin.
// A proper implementation would be to have a separate admin login or a role check.

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

// Logout Logic
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    Ui.alert(
      "question",
      "Admin Sign Out",
      "Securely logging out of administration panel..."
    ).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  });
}

const updateAdminDashboardUI = (users, transactions) => {
  const totalUsersEl = document.querySelector('.grid .glass-panel:nth-child(1) h3');
  const totalDepositedEl = document.querySelector('.grid .glass-panel:nth-child(2) h3');
  const pendingDepositsEl = document.querySelector('.grid .glass-panel:nth-child(3) h3');
  const pendingWithdrawalsEl = document.querySelector('.grid .glass-panel:nth-child(4) h3');

  if(totalUsersEl) totalUsersEl.textContent = users.length;

  const totalDeposited = transactions
    .filter(tx => tx.type === 'deposit' && tx.status === 'approved')
    .reduce((sum, tx) => sum + tx.amount, 0);
  if(totalDepositedEl) totalDepositedEl.textContent = `$${totalDeposited.toLocaleString()}`;

  const pendingDeposits = transactions.filter(tx => tx.type === 'deposit' && tx.status === 'pending').length;
  if(pendingDepositsEl) pendingDepositsEl.textContent = pendingDeposits;
  
  const pendingWithdrawals = transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'pending').length;
  if(pendingWithdrawalsEl) pendingWithdrawalsEl.textContent = pendingWithdrawals;

  const recentActivityTbody = document.querySelector('.glass-panel table tbody');
  if(recentActivityTbody) {
    recentActivityTbody.innerHTML = '';
    transactions.slice(0, 5).forEach(tx => {
      const user = users.find(u => u.id === tx.userId);
      const row = `
        <tr>
          <td class="p-4 font-medium text-white">${user ? user.fullname : 'Unknown'}</td>
          <td class="p-4">
            <span class="${tx.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}">${tx.type} ${tx.status}</span>
          </td>
          <td class="p-4">$${tx.amount.toLocaleString()}</td>
          <td class="p-4 text-right text-slate-500">${new Date(tx.createdAt).toLocaleTimeString()}</td>
        </tr>
      `;
      recentActivityTbody.innerHTML += row;
    });
  }
}

// Admin Chart Initialization
export async function initAdminCharts() {
  const { data: users, status: usersStatus } = await apiCall('/api/admin/users');
  const { data: transactions, status: transactionsStatus } = await apiCall('/api/transactions'); // This endpoint needs to be created

  if(usersStatus !== 200 || transactionsStatus !== 200) {
    Ui.alert('error', 'Failed to fetch admin data');
    if(usersStatus === 401 || transactionsStatus === 401) logout();
    return;
  }

  updateAdminDashboardUI(users, transactions);

  const userGrowthEl = document.querySelector("#userGrowthChart");
  const cashflowEl = document.querySelector("#cashflowChart");

  if (userGrowthEl) {
    const options = {
      series: [
        {
          name: "New Users",
          data: [4, 12, 18, 25, 42, 68, users.length],
        },
      ],
      chart: {
        type: "bar",
        height: 300,
        toolbar: { show: false },
        fontFamily: "Outfit, sans-serif",
        background: "transparent",
      },
      colors: ["#22d3ee"],
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: "40%" },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#94a3b8" } },
      },
      yaxis: {
        labels: { style: { colors: "#94a3b8" } },
      },
      grid: {
        borderColor: "#1e293b",
        strokeDashArray: 4,
      },
      theme: { mode: "dark" },
    };
    new ApexCharts(userGrowthEl, options).render();
  }

  if (cashflowEl) {
    const options = {
      series: [
        {
          name: "Deposits",
          data: [31000, 40000, 28000, 51000, 42000, 60000, 75000],
        },
        {
          name: "Withdrawals",
          data: [11000, 32000, 45000, 32000, 34000, 52000, 41000],
        },
      ],
      chart: {
        type: "area",
        height: 300,
        toolbar: { show: false },
        fontFamily: "Outfit, sans-serif",
        background: "transparent",
      },
      colors: ["#22d3ee", "#f43f5e"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        labels: { style: { colors: "#94a3b8" } },
      },
      yaxis: {
        labels: {
          style: { colors: "#94a3b8" },
          formatter: (value) => {
            return "$" + value / 1000 + "k";
          },
        },
      },
      grid: {
        borderColor: "#1e293b",
        strokeDashArray: 4,
      },
      theme: { mode: "dark" },
    };
    new ApexCharts(cashflowEl, options).render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminCharts();
});

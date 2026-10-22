import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventIcon from "@mui/icons-material/Event";
import VerifiedIcon from "@mui/icons-material/Verified";

import { usegetuseractivityreport } from "../../hooks/useadmin";
import { roleBadgeClass } from "./adminBrand";

type UserActivityReportProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

const mono = "'IBM Plex Mono', ui-monospace, monospace";

const UserActivityReportDialog = ({ id, open, onClose }: UserActivityReportProps) => {
  const { data, isLoading, isError, error } = usegetuseractivityreport(id);
  const report = data?.data;
  const user = report?.user;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="user-activity-dialog-title"
      slotProps={{ paper: { sx: {
          borderRadius: 0,
          border: "1px solid #14213D",
          bgcolor: "#FFFDF9",
          boxShadow: "none",
        } } }}
    >
      {/* Dialog Header */}
      <DialogTitle
        id="user-activity-dialog-title"
        sx={{ bgcolor: "#14213D", color: "#FFFDF9", p: 2.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow text-[#B8863B]">Report</p>
            <h2 className="font-heading mt-1 text-2xl font-semibold text-[#FFFDF9]">
              User Activity Report
            </h2>
            <p className="font-data mt-1 text-xs font-normal text-[#FFFDF9]/60">
              Activity report for user #{id}
            </p>
          </div>
          <IconButton
            onClick={onClose}
            aria-label="close"
            size="small"
            sx={{ color: "#FFFDF9", "&:hover": { color: "#B8863B" } }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Dialog Body */}
      <DialogContent sx={{ p: 3, fontFamily: mono }}>
        {isLoading && (
          <div className="flex min-h-[250px] items-center justify-center">
            <CircularProgress sx={{ color: "#B8863B" }} />
          </div>
        )}

        {isError && (
          <Alert
            severity="error"
            sx={{
              mt: 1,
              borderRadius: 0,
              fontFamily: mono,
              fontSize: "0.75rem",
              border: "1px solid #B8452E",
              bgcolor: "#FFFDF9",
              color: "#B8452E",
            }}
          >
            {error instanceof Error ? error.message : "Failed to load activity report. Please try again."}
          </Alert>
        )}

        {!isLoading && !isError && report && user && (
          <div className="mt-2 space-y-8">
            {/* User Profile Card */}
            <div className="border border-[#14213D]/15 bg-white p-6">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                {/* User Details */}
                <div className="flex items-center gap-4 md:col-span-2">
                  <Avatar
                    variant="square"
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "#14213D",
                      color: "#B8863B",
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: "1.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[#14213D]">
                      {user.name}
                    </h3>
                    <p className="mb-2 text-xs text-[#4A5568]">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`eyebrow border px-2 py-1 font-semibold ${roleBadgeClass(user.role)}`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`eyebrow border px-2 py-1 font-semibold ${
                          user.isActive
                            ? "border-[#5B7B65] bg-[#5B7B65]/10 text-[#5B7B65]"
                            : "border-[#14213D]/30 text-[#14213D]/60"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Box */}
                <div className="border border-[#E4DFD3] bg-[#FFFDF9] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <VerifiedIcon
                      fontSize="small"
                      sx={{ color: user.isVerified ? "#5B7B65" : "#C9C3B4" }}
                    />
                    <span className="eyebrow font-semibold text-[#14213D]">
                      Verification
                    </span>
                  </div>
                  <p className="text-xs capitalize text-[#4A5568]">
                    {user.isVerified ? "Fully Verified" : "Not Verified"} • {user.verificationStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats Summary */}
            <div>
              <h3 className="font-heading mb-3 text-xl font-semibold text-[#14213D]">
                Activity Summary
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Properties", value: report.properties, icon: <HomeIcon sx={{ color: "#B8863B" }} /> },
                  { label: "Purchase Requests", value: report.purchaseRequests, icon: <ShoppingCartIcon sx={{ color: "#B8863B" }} /> },
                  { label: "Rental Requests", value: report.rentalRequests, icon: <EventIcon sx={{ color: "#B8863B" }} /> },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="border border-[#14213D]/15 bg-white p-5 transition hover:border-[#B8863B]"
                  >
                    <div className="eyebrow mb-3 flex items-center gap-2 text-[#14213D]/60">
                      {stat.icon}
                      <span>{stat.label}</span>
                    </div>
                    <div className="font-heading text-4xl font-semibold text-[#14213D]">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #E4DFD3" }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 0,
            border: "1px solid #14213D",
            color: "#14213D",
            fontFamily: mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            px: 2.5,
            "&:hover": { bgcolor: "#14213D", color: "#FFFDF9" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserActivityReportDialog;

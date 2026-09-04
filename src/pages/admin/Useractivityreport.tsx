import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  Alert,
  Avatar,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventIcon from "@mui/icons-material/Event";
import VerifiedIcon from "@mui/icons-material/Verified";

import { usegetuseractivityreport } from "../../hooks/useadmin";

type UserActivityReportProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

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
    >
      {/* Dialog Header */}
      <DialogTitle id="user-activity-dialog-title" className="!p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">User Activity Report</h2>
            <p className="text-sm text-gray-500">Activity report for user #{id}</p>
          </div>
          <IconButton onClick={onClose} aria-label="close" size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Dialog Body */}
      <DialogContent className="!p-6">
        {isLoading && (
          <div className="min-h-[250px] flex items-center justify-center">
            <CircularProgress />
          </div>
        )}

        {isError && (
          <Alert severity="error" className="mt-2">
            {error instanceof Error ? error.message : "Failed to load activity report. Please try again."}
          </Alert>
        )}

        {!isLoading && !isError && report && user && (
          <div className="space-y-6 mt-2">
            {/* User Profile Card */}
            <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* User Details */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: "1.5rem" }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <Chip label={user.role} size="small" variant="outlined" />
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={user.isActive ? "success" : "default"}
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Box */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <VerifiedIcon color={user.isVerified ? "success" : "disabled"} fontSize="small" />
                    <span className="text-sm font-semibold text-gray-800">Verification Status</span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">
                    {user.isVerified ? "Fully Verified" : "Not Verified"} • {user.verificationStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats Summary */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">Activity Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Properties", value: report.properties, icon: <HomeIcon color="primary" /> },
                  { label: "Purchase Requests", value: report.purchaseRequests, icon: <ShoppingCartIcon color="primary" /> },
                  { label: "Rental Requests", value: report.rentalRequests, icon: <EventIcon color="primary" /> },
                ].map((stat, index) => (
                  <div key={index} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      {stat.icon}
                      <span>{stat.label}</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      <Divider />

      {/* Dialog Actions */}
      <DialogActions className="!px-6 !py-4">
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserActivityReportDialog;

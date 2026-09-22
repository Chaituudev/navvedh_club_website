export function publicUser(user: any) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile ?? "",
    college: user.college ?? "",
    department: user.department ?? "",
    year: user.year ?? "",
    prnStudentId: user.prnStudentId ?? "",
    skills: user.skills ?? [],
    githubUrl: user.githubUrl ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    profileImageUrl: user.profileImageUrl ?? "",
    emailNotifications: user.emailNotifications ?? true,
    isActive: user.isActive ?? true,
    roles: user.roles ?? ["STUDENT"],
    adminPermissions: user.adminPermissions ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

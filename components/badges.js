const Badges = ({ label = "label", type = "primary" }) => {
  return <span class={`badge bg-label-${type}`}>{label}</span>;
};

export default Badges;

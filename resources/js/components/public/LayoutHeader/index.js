import QrcodeModal from "~/js/components/public/QrcodeModal";

$(".layout-header a").on("click", function (e) {
  if ($(this).attr("qrcode")) {
    e.preventDefault();
    const qrcode = JSON.parse($(this).attr("qrcode"));
    new QrcodeModal(qrcode).mount();
  }
});

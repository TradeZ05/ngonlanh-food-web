/**
 * Dữ liệu món — dùng chung cho trang chủ, chi tiết, (mở rộng sau này).
 */
window.CHAY_PRODUCTS = [
    {
        id: "pho-chay",
        name: "Phở chay nấm & hạt sen",
        desc: "Nước dùng nấm shiitake, thơm quế hồi, bánh phở tráng tay.",
        longDesc:
            "Phở chay với nước dùng hầm từ nấm shiitake, củ cải và gia vị thảo mộc, không dùng bột ngọt. Bánh phở mỏng tráng tay, ăn kèm hạt sen, ngò và giá trần.",
        price: 59000,
        category: "mon-nuoc",
        image: "/images/products/pho-chay.svg",
        ingredients: ["Bánh phở", "Nấm shiitake", "Hạt sen", "Quế, hồi", "Rau thơm, giá"],
        allergens: "Có đậu nành, gluten từ bánh phở (tuỳ lô sản xuất).",
        prepTime: "15 phút",
    },
    {
        id: "bun-rieu",
        name: "Bún riêu chay",
        desc: "Riêu đậu nành, cà chua, đậu phụ chiên, rau thơm đủ loại.",
        longDesc:
            "Riêu làm từ đậu nành xay và nấm mèo, sốt cà chua chua ngọt tự nhiên. Ăn kèm đậu phụ chiên giòn, chả chay và rau sống.",
        price: 55000,
        category: "mon-nuoc",
        image: "/images/products/bun-rieu.svg",
        ingredients: ["Bún tươi", "Đậu nành", "Cà chua", "Đậu phụ", "Rau thơm, kinh giới"],
        allergens: "Đậu nành, có thể có gluten từ chả chay.",
        prepTime: "12 phút",
    },
    {
        id: "com-tam",
        name: "Cơm tấm sườn chay",
        desc: "Sườn chay nướng mật ong, bì chay, dưa chua, mỡ hành chay.",
        longDesc:
            "Cơm tấm dẻo với miếng sườn chay từ gluten & nấm, nướng mật ong rừng. Bì chay sợi, dưa chua nhà làm, mỡ hành phi từ dầu thực vật.",
        price: 65000,
        category: "com",
        image: "/images/products/com-tam.svg",
        ingredients: ["Cơm tấm", "Gluten / nấm", "Bì chay", "Dưa chua", "Mỡ hành chay"],
        allergens: "Gluten, đậu nành.",
        prepTime: "10 phút",
    },
    {
        id: "com-hop",
        name: "Cơm hộp văn phòng",
        desc: "3 món xào + canh + cơm gạo lứt — thay món theo ngày.",
        longDesc:
            "Hộp cơm đủ chất: cơm gạo lứt hồng, ba món xào/kho theo thực đơn ngày, canh rau củ. Thực đơn cập nhật trên fanpage mỗi sáng.",
        price: 75000,
        category: "com",
        image: "/images/products/com-hop.svg",
        ingredients: ["Gạo lứt", "Rau củ theo mùa", "Đậu hũ / nấm", "Canh"],
        allergens: "Tuỳ món trong ngày — vui lòng ghi chú dị ứng khi đặt.",
        prepTime: "8 phút (đóng sẵn)",
    },
    {
        id: "goi-cuon",
        name: "Gỏi cuốn tôm chay",
        desc: "Tôm chay thanh long, bún, rau sống, chấm mắm me chay.",
        longDesc:
            "Cuốn tại chỗ với tôm chay làm từ thanh long & bột đậu, bún lá, rau húng, xà lách. Mắm me pha chay ngọt mặn vừa.",
        price: 45000,
        category: "an-vat",
        image: "/images/products/goi-cuon.svg",
        ingredients: ["Bánh tráng", "Bún", "Rau sống", "Tôm chay", "Mắm me chay"],
        allergens: "Đậu nành, có thể có đậu phộng trong mắm (liên hệ để bỏ).",
        prepTime: "7 phút",
    },
    {
        id: "banh-mi",
        name: "Bánh mì pate chay",
        desc: "Pate đậu gà, chà bông chay, dưa leo, ngò rí.",
        longDesc:
            "Ổ bánh mì giòn, pate béo từ đậu gà & nấm, chà bông chay sợi, dưa leo, đồ chua, ngò.",
        price: 35000,
        category: "an-vat",
        image: "/images/products/banh-mi.svg",
        ingredients: ["Bánh mì", "Pate đậu", "Chà bông chay", "Dưa leo", "Đồ chua"],
        allergens: "Gluten, đậu nành.",
        prepTime: "5 phút",
    },
];

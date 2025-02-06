const HotelBooking = artifacts.require("HotelBooking");

module.exports = function (deployer) {

  deployer.deploy(HotelBooking).then(async (instance) => {
    // 초기 호텔 추가
    await instance.addHotel("Hotel Sunshine", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(1, 101, web3.utils.toWei("0.1", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(1, 102, web3.utils.toWei("0.15", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(1, 103, web3.utils.toWei("0.15", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(1, 104, web3.utils.toWei("0.15", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(1, 105, web3.utils.toWei("0.15", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Ocean View Resort", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(2, 201, web3.utils.toWei("0.2", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(2, 202, web3.utils.toWei("0.25", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(2, 203, web3.utils.toWei("0.25", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(2, 204, web3.utils.toWei("0.25", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(2, 205, web3.utils.toWei("0.25", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Mountain Retreat", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(3, 301, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(3, 302, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(3, 303, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(3, 304, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(3, 305, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(3, 306, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Luminary Haven", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(4, 401, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(4, 402, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(4, 403, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(4, 404, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(4, 405, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(4, 406, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Eclipse Suites", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(5, 501, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(5, 502, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(5, 503, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(5, 504, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(5, 505, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(5, 506, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Velvet Horizon", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(6, 601, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(6, 602, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(6, 603, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(6, 604, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(6, 605, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(6, 606, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Onyx Oasis", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(7, 701, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(7, 702, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(7, 703, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(7, 704, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(7, 705, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(7, 706, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Cerulean Retreat", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(8, 801, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(8, 802, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(8, 803, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(8, 804, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(8, 805, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(8, 806, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Ember Alcove", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(9, 901, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(9, 902, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(9, 903, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(9, 904, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(9, 905, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(9, 906, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Aurora Pavilion", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(10, 1001, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(10, 1002, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(10, 1003, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(10, 1004, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(10, 1005, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(10, 1006, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Opal Sanctuary", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(11, 1101, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(11, 1102, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(11, 1103, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(11, 1104, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(11, 1105, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(11, 1106, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Saffron Skies", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(12, 1201, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(12, 1202, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(12, 1203, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(12, 1204, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(12, 1205, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(12, 1206, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Quartz Haven", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(13, 1301, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(13, 1302, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(13, 1303, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(13, 1304, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(13, 1305, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(13, 1306, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Mirage Manor", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(14, 1401, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(14, 1402, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(14, 1403, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(14, 1404, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(14, 1405, web3.utils.toWei("0.18", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(14, 1406, web3.utils.toWei("0.22", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    // 초기화 완료 메시지
    console.log("Hotels and rooms initialized successfully!");
  });


}
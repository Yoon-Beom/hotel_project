const HotelBooking = artifacts.require("HotelBooking");

module.exports = function(deployer) {
  deployer.deploy(HotelBooking).then(async (instance) => {
    // 초기 호텔 추가
    await instance.addHotel("Hotel Sunshine", "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(1, 101, web3.utils.toWei("0.1", "ether"), "QmX7b5jxn6Hj2iyqDpC1joVGEGhdGxS3nCRvXgUZqgZYpK");
    await instance.addRoom(1, 102, web3.utils.toWei("0.15", "ether"), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");

    await instance.addHotel("Ocean View Resort", "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    await instance.addRoom(2, 201, web3.utils.toWei("0.2", "ether"), "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx");
    await instance.addRoom(2, 202, web3.utils.toWei("0.25", "ether"), "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn");

    await instance.addHotel("Mountain Retreat", "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx");
    await instance.addRoom(3, 301, web3.utils.toWei("0.18", "ether"), "QmPXME1oRtoT627YKaDPDQ3PwA8tdP9rWuAAweLzqSwAWT");
    await instance.addRoom(3, 302, web3.utils.toWei("0.22", "ether"), "QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE");

    // 초기화 완료 메시지
    console.log("Hotels and rooms initialized successfully!");
  });
};
